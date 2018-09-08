package listener

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/nebojsa94/smart-alert/backend/ethereum"
	"github.com/nebojsa94/smart-alert/backend/model"
	"github.com/nebojsa94/smart-alert/backend/service"
	"net/http"
	"os"
	"os/signal"
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
				processBlock(l, client, blockNum)
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

func processBlock(l *Listener, client *ethereum.Client, blockNumber int64) {
	block, err := client.GetBlock(blockNumber)
	if err != nil {
		fmt.Println("Block fetching failed")
		return
	}

	for _, t := range block.Transactions {
		if c, err := l.ContractService.Get(t.To); err == nil {
			processTransaction(l.TransactionService, l.TriggerService, l.AlertService, c, client, t)
		}
	}
}

func processTransaction(transactionService service.TransactionService, triggerService service.TriggerService, alertService service.AlertService, contract *model.Contract, client *ethereum.Client, t *ethereum.Transaction) {
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

	triggers, _ := triggerService.GetAll(contract.Address)

	decodeInput, _ := hex.DecodeString(t.Input[2:])
	decodedData, err := service.ParseCallData(decodeInput, contract.Abi)
	if err != nil {
		fmt.Print("Unable to decode data")
	}

	for _, trigger := range *triggers {
		switch trigger.Type {
		case model.WithdrawCalled:
			{
				if trigger.Method == decodedData.Name {
					fmt.Println("Withdraw Called")
				}
			}

		case model.NonAuthorizedWithdraw:
			{
				if trigger.Method == decodedData.Name {
					fmt.Println("Withdraw Called")
				}
			}
		case model.HighFailedTransactions:
			{

			}
		case model.InvalidContractMethod:
			{

			}
		case model.ContractCalling:
			{

			}
		case model.BlockFilling:
			{

			}
		case model.ValidateIpfs:
			{
				resp, err := http.Get("https://ipfs.decenter.com/api/v0/object/stat?arg=" + decodedData.Inputs[trigger.InputStrings[0].Position-1].Value.(string))
				if err != nil {
					ValidationFailed(alertService, transaction, model.ValidateIpfs, map[string]string{
						"err": err.Error(),
					})
				}

				var ipfsResponse IPFSResponse
				json.NewDecoder(resp.Body).Decode(&ipfsResponse)

				if ipfsResponse.CumulativeSize > 1000 {
					ValidationFailed(alertService, transaction, trigger.Id.Hex(), map[string]string{
						"err":  "File too big",
						"size": string(ipfsResponse.CumulativeSize),
					})
				}
			}
		case model.HighGasPrice:
			{

			}
		case model.InputCriteria:
			{

			}
		}
	}
}

func ValidationFailed(service service.AlertService, transaction *model.Transaction, triggerId string, parameters map[string]string) {
	alert := model.NewAlert(triggerId, transaction.Hash, parameters)
	service.Create(alert)
}
