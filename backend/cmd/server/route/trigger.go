package route

import (
	"errors"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"github.com/nebojsa94/smart-alert/backend/cmd/server/helper"
	"github.com/nebojsa94/smart-alert/backend/ethereum"
	"github.com/nebojsa94/smart-alert/backend/listener"
	"github.com/nebojsa94/smart-alert/backend/model"
	"github.com/nebojsa94/smart-alert/backend/service"
	"log"
	"net/http"
)

type CreateTriggerRequest struct {
	ContractAddress string                  `json:"contractAddress"`
	Type            string                  `json:"type"`
	Name            string                  `json:"name"`
	Description     string                  `json:"description"`
	Level           int                     `json:"level"`
	Method          string                  `json:"method"`
	InputUints      []model.ArgumentsUint   `json:"inputUints"`
	InputStrings    []model.ArgumentsString `json:"inputStrings"`
	OutputUints     []model.ArgumentsUint   `json:"outputUints"`
	OutputStrings   []model.ArgumentsString `json:"outputStrings"`
}

func (r CreateTriggerRequest) Valid() bool {
	return true
}

func CreateTrigger(contractService service.ContractService, transactionService service.TransactionService, service service.TriggerService, alertService service.AlertService) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		id := params.ByName("id")
		if id == "" {
			helper.SendResponse(w, 400, helper.Response{
				"error": "Missing organization ID",
			})
			return
		}

		contract, err := contractService.Get(id)
		if err != nil {
			helper.SendResponse(w, 400, helper.Response{
				"error": "Contract not found",
			})
			return
		}

		var request CreateTriggerRequest

		if !helper.ReadBody(w, r, &request) {
			return
		}

		if !request.Valid() {
			helper.BadRequestError(w, errors.New("form not valid"))
			return
		}

		trigger := model.NewTrigger(request.ContractAddress, request.Type, request.Name, request.Description, request.Level,
			request.Method, request.InputUints, request.InputStrings, request.OutputUints, request.OutputStrings)

		err = service.Create(trigger)
		if err != nil {
			log.Printf("create contract: %s", err)

			helper.SendResponse(w, 400, helper.Response{
				"error": err.Error(),
			})
			return
		}

		processPreviousBlocks(contractService, transactionService, service, alertService, int64(contract.BlockNumber))

		helper.SendResponse(w, 201, trigger)
	}
}

func GetTrigger(service model.TriggerService) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		id := params.ByName("triggerId")
		if id == "" {
			helper.SendResponse(w, 400, helper.Response{
				"error": "Missing organization ID",
			})
			return
		}

		trigger, err := service.Get(id)
		if err != nil {
			log.Printf("get contract: %s", err)

			helper.BadRequestError(w, err)
			return
		}

		helper.SendResponse(w, 200, trigger)
	}
}

func GetAllTrigger(service model.TriggerService) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		id := params.ByName("id")
		if id == "" {
			helper.SendResponse(w, 400, helper.Response{
				"error": "Missing organization ID",
			})
			return
		}

		triggers, err := service.GetAll(id)
		if err != nil {
			log.Printf("get contract: %s", err)

			helper.BadRequestError(w, err)
			return
		}

		helper.SendResponse(w, 200, triggers)
	}
}

func processPreviousBlocks(contractService service.ContractService, transactionService service.TransactionService, triggerService service.TriggerService, alertService service.AlertService, blockNumber int64) {
	host := "kovan.decenter.com:4443"
	client, err := ethereum.Dial(host)
	if err != nil {
		fmt.Println("Unable to connect to node", err)
		return
	}

	currentBlockNumber, err := client.CurrentBlockNumber()

	for i := blockNumber; i < currentBlockNumber; i++ {
		listener.ProcessBlock(contractService, transactionService, triggerService, alertService, client, i)
	}
}
