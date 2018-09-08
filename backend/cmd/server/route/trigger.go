package route

import (
	"errors"
	"github.com/julienschmidt/httprouter"
	"github.com/nebojsa94/smart-alert/backend/cmd/server/helper"
	"github.com/nebojsa94/smart-alert/backend/model"
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

func CreateTrigger(service model.TriggerService) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
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

		err := service.Create(trigger)
		if err != nil {
			log.Printf("create contract: %s", err)

			helper.SendResponse(w, 400, helper.Response{
				"error": err.Error(),
			})
			return
		}

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
