package listener

import (
	"context"
	"fmt"
	"github.com/nebojsa94/smart-alert/backend/ethereum"
	"github.com/nebojsa94/smart-alert/backend/model"
	"github.com/nebojsa94/smart-alert/backend/service"
	"os"
	"os/signal"
)

type Listener struct {
	ContractService    service.ContractService
	TransactionService service.TransactionService
	TriggerService     service.TriggerService
}

func NewListener(contractService service.ContractService, transactionService service.TransactionService, triggerService service.TriggerService) *Listener {
	return &Listener{
		ContractService:    contractService,
		TransactionService: transactionService,
		TriggerService:     triggerService,
	}
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
		fmt.Println(t.To)
		if c, err := l.ContractService.Get(t.To); err == nil {
			processTransaction(l.TransactionService, l.TriggerService, c, client, t)
		}
	}
}

func processTransaction(transactionService service.TransactionService, triggerService service.TriggerService, contract *model.Contract, client *ethereum.Client, t *ethereum.Transaction) {
	fmt.Println("Processing transaction", t.To)
	fmt.Printf("Trnasction %s", t.To)
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
		fmt.Println("Transaction failed for contract")
		err := transactionService.Process(transaction, contract, false)
		if err != nil {
			fmt.Println(err)
		}
	case 1:
		fmt.Println("Transaction successful for contract")

		err := transactionService.Process(transaction, contract, true)
		if err != nil {
			fmt.Println(err)
		}
	default:
		fmt.Println("Transaction in unknown status")
	}

	triggers, _ := triggerService.GetAll(contract.Address)

	for _, trigger := range *triggers {
		switch trigger.Type {
		case model.WithdrawCalled:
			{

			}
		}
	}
}
