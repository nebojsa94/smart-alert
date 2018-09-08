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

	return router
}
