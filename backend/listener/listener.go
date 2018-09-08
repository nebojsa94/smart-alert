package listener

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/nebojsa94/smart-alert/backend/ethereum"
	"github.com/nebojsa94/smart-alert/backend/model"
	"github.com/nebojsa94/smart-alert/backend/service"
	"net/http"
	"os"
	"os/signal"
	"regexp"
	"strconv"
	"strings"
)

type Listener struct {
	ContractService    service.ContractService
	TransactionService service.TransactionService
	TriggerService     service.TriggerService
	AlertService       service.AlertService
}

func NewListener(contractService service.ContractService, transactionService service.TransactionService, triggerService service.TriggerService, alertService service.AlertService) *Listener {
	return &Listener{
		ContractService:    contractService,
		TransactionService: transactionService,
		TriggerService:     triggerService,
		AlertService:       alertService,
	}
}

type IPFSResponse struct {
	Hash           string
	NumLinks       int
	BlockSize      int
	LinksSize      int
	DataSize       int
	CumulativeSize int
}

func (l *Listener) Listen() {
	host := "kovan.decenter.com:4443"

	go func() {
		client, err := ethereum.Dial(host)
		if err != nil {
			fmt.Println("Unable to connect to node", err)
			return
		}

		sub, err := client.Subscribe()
		if err != nil {
			fmt.Println("Cannot subscribe to network")
			return
		}

		ctx := makeContext()

		for {
			select {
			case <-ctx.Done():
				fmt.Println("Interrupt signal received, exiting...")
				os.Exit(0)
			case blockNum := <-sub:
				ProcessBlock(l.ContractService, l.TransactionService, l.TriggerService, l.AlertService, client, blockNum)
			}
		}
	}()
}

func makeContext() context.Context {
	ctx, cancel := context.WithCancel(context.Background())
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	go func() {
		<-c

		cancel()
	}()

	return ctx
}

func ProcessBlock(contractService service.ContractService, transactionService service.TransactionService, triggerService service.TriggerService, alertService service.AlertService, client *ethereum.Client, blockNumber int64) {
	block, err := client.GetBlock(blockNumber)
	if err != nil {
		fmt.Println("Block fetching failed")
		return
	}

	for _, t := range block.Transactions {
		if c, err := contractService.Get(t.To); err == nil {
			ProcessTransaction(transactionService, triggerService, alertService, c, client, t, block)
		}
	}
}

func ProcessTransaction(transactionService service.TransactionService, triggerService service.TriggerService, alertService service.AlertService, contract *model.Contract, client *ethereum.Client, t *ethereum.Transaction, block *ethereum.Block) {
	fmt.Println("Processing transaction", t.To)
	receipt, err := client.GetTransactionReceipt(t.Hash)
	if err != nil {
		fmt.Println("Failed getting transaction receipt")
		return
	}

	if receipt.Status == nil {
		fmt.Println("Transaction does not have receipt status")
		return
	}

	transaction := transactionService.ConvertEthereumTransaction(t, contract)

	triggers, _ := triggerService.GetAll(contract.Address)

	decodeInput, _ := hex.DecodeString(t.Input[2:])
	decodedData, err := service.ParseCallData(decodeInput, contract.Abi)
	if err != nil {
		abispec, _ := abi.JSON(strings.NewReader(contract.Abi))
		if _, err := service.MethodById(&abispec, decodeInput[:4]); err != nil {
			for _, trigger := range *triggers {
				if trigger.Type == model.InvalidContractMethod {
					ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
						"alert": "Invalid contract method",
						"hash":  string(decodeInput[:4]),
					})
				}
			}
		}
		fmt.Print("Unable to decode data")
		return
	}
	transaction.DecodedCallData = decodedData

	switch receipt.Status.Value() {
	case 0:
		err := transactionService.Process(transaction, contract, false)
		if err != nil {
			fmt.Println(err)
		}
	case 1:
		err := transactionService.Process(transaction, contract, true)
		if err != nil {
			fmt.Println(err)
		}
	default:
		fmt.Println("Transaction in unknown status")
	}

	for _, trigger := range *triggers {
		switch trigger.Type {
		case model.WithdrawCalled:
			{
				if trigger.Method == decodedData.Name && transaction.Ok {
					ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
						"alert":   "Withdraw Called",
						"address": transaction.From,
					})
				}
			}

		case model.NonAuthorizedWithdraw:
			{
				if trigger.Method == decodedData.Name && !transaction.Ok {
					ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
						"alert":   "Unauthorized Withdraw Called",
						"address": transaction.From,
					})
				}
			}
		case model.HighFailedTransactions:
			{
				failed := 0
				success := 0
				for i := len(*transactionService.GetAll(contract.Address)) - 1; i > max(len(*transactionService.GetAll(contract.Address))-11, 0); i-- {
					if transaction.Ok {
						success++
					} else {
						failed++
					}
				}

				if failed > success {
					ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
						"alert":   "Detected high number of failed transactions",
						"failed":  string(failed),
						"success": string(success),
					})
				}
			}
		case model.ContractCalling:
			{
				trace, err := client.GetTransactionTrace(t.Hash)
				if err != nil {
					fmt.Println("Unable to trace")
					return
				}

				address := t.To

				for _, state := range trace.States() {
					if state.Op() == "CALL" {
						if "0x"+state.Stack()[len(state.Stack())-2][:24] == address {
							ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
								"alert":   "Contract calling",
								"address": address,
							})
						}
					}
				}
			}
		case model.BlockFilling:
			{
				var count map[string]int
				max := 0
				var maxAddress string
				total := 0
				for _, t := range block.Transactions {
					if t.To == contract.Address {
						count[t.From]++
						total++
						if count[t.From] > max {
							max = count[t.From]
							maxAddress = t.From
						}
					}
				}

				if total > 8 && maxAddress != "" && count[maxAddress]*2 > total {
					ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
						"alert":   "Block filling",
						"address": maxAddress,
						"count":   string(count[maxAddress]),
						"total":   string(total),
					})
				}
			}
		case model.ValidateIpfs:
			{
				resp, err := http.Get("https://ipfs.decenter.com/api/v0/object/stat?arg=" + decodedData.Inputs[trigger.InputStrings[0].Position-1].Value.(string))
				if err != nil {
					ValidationFailed(alertService, transaction, model.ValidateIpfs, map[string]string{
						"alert": err.Error(),
					})
				}

				var ipfsResponse IPFSResponse
				json.NewDecoder(resp.Body).Decode(&ipfsResponse)

				if ipfsResponse.CumulativeSize > 1000 {
					ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
						"alert": "File too big",
						"size":  string(ipfsResponse.CumulativeSize),
					})
				}
			}
		case model.HighGasPrice:
			{
				count := 0
				total := 0
				for _, t := range block.Transactions {
					if t.To == contract.Address {
						total++
						gasPrice, _ := strconv.ParseInt(t.GasPrice, 16, 64)
						if gasPrice > 100000000000 {
							count++
						}
					}
				}

				if total > 8 && count*2 > total {
					ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
						"alert": "High gas prices",
						"count": string(count),
						"total": string(total),
					})
				}
			}
		case model.InputCriteria:
			{
				for _, input := range trigger.InputStrings {
					if matched, _ := regexp.Match(input.Value, []byte(decodedData.Inputs[input.Position-1].Value.(string))); matched {
						ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
							"alert":    "Input criteria matched",
							"method":   trigger.Method,
							"position": string(input.Position),
							"regex":    input.Value,
						})
					}

				}
			}
		}
	}
}

func ValidationFailed(service service.AlertService, transaction *model.Transaction, triggerId string, parameters map[string]string) {
	alert := model.NewAlert(triggerId, transaction.Hash, parameters)
	service.Create(alert)
}

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}
