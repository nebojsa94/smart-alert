package route

import (
	"github.com/julienschmidt/httprouter"
	"github.com/nebojsa94/smart-alert/backend/cmd/server/helper"
	"github.com/nebojsa94/smart-alert/backend/model"
	"net/http"
)

func GetAlert(service model.AlertService) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		id := params.ByName("triggerId")
		if id == "" {
			helper.SendResponse(w, 400, helper.Response{
				"error": "Missing organization ID",
			})
			return
		}

		alerts := service.Get(id, false)

		helper.SendResponse(w, 200, alerts)
	}
}

func GetAllAlert(service model.AlertService, onlyUnread bool) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		id := params.ByName("id")
		if id == "" {
			helper.SendResponse(w, 400, helper.Response{
				"error": "Missing organization ID",
			})
			return
		}

		alerts := service.GetAll(id, onlyUnread)

		helper.SendResponse(w, 200, alerts)
	}
}
