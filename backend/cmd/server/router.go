package main

import (
	"github.com/julienschmidt/httprouter"
	"github.com/nebojsa94/smart-alert/backend/cmd/server/middleware"
	"github.com/nebojsa94/smart-alert/backend/cmd/server/route"
)

func NewRouter(app *Application) *httprouter.Router {
	router := httprouter.New()

	base := middleware.Stack{}

	router.POST("/api/contract", base.Do(route.CreateContract(app.ContractService)))
	router.GET("/api/contract/:id", base.Do(route.GetContract(app.ContractService)))

	router.POST("/api/contract/:id/trigger", base.Do(route.CreateTrigger(app.TriggerService)))
	router.GET("/api/contract/:id/triggers", base.Do(route.GetAllTrigger(app.TriggerService)))
	router.GET("/api/contract/:id/trigger/:triggerId", base.Do(route.GetTrigger(app.TriggerService)))

	return router
}
