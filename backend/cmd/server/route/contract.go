package route

import (
	"errors"
	"github.com/julienschmidt/httprouter"
	"github.com/nebojsa94/smart-alert/backend/cmd/server/helper"
	"github.com/nebojsa94/smart-alert/backend/model"
	"log"
	"net/http"
)

type CreateContractRequest struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Abi     string `json:"abi"`
}

func (r CreateContractRequest) Valid() bool {
	return true
}

func CreateContract(service model.ContractService) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		var request CreateContractRequest

		if !helper.ReadBody(w, r, &request) {
			return
		}

		if !request.Valid() {
			helper.BadRequestError(w, errors.New("form not valid"))
			return
		}

		contract := model.NewContract(request.Name, request.Address, request.Abi)

		err := service.Create(contract)
		if err != nil {
			log.Printf("create contract: %s", err)

			helper.SendResponse(w, 400, helper.Response{
				"error": err.Error(),
			})
			return
		}

		helper.SendResponse(w, 201, contract)
	}
}

func GetContract(service model.ContractService) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		id := params.ByName("id")
		if id == "" {
			helper.SendResponse(w, 400, helper.Response{
				"error": "Missing organization ID",
			})
			return
		}

		contract, err := service.Get(id)
		if err != nil {
			log.Printf("get contract: %s", err)

			helper.BadRequestError(w, err)
			return
		}

		helper.SendResponse(w, 200, contract)
	}
}
