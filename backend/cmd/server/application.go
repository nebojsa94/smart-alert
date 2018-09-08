package main

import (
	"fmt"
	"github.com/go-bongo/bongo"
	"github.com/julienschmidt/httprouter"
	l "github.com/nebojsa94/smart-alert/backend/listener"
	"github.com/nebojsa94/smart-alert/backend/service"
	"github.com/rs/cors"
	"log"
	"net/http"
)

type Application struct {
	ContractService    *service.ContractService
	AlertService       *service.AlertService
	TriggerService     *service.TriggerService
	TransactionService *service.TransactionService

	Router *httprouter.Router
}

func NewApplication() *Application {
	//config.Init()

	bongoConfig := &bongo.Config{
		ConnectionString: "46.101.140.249:27017",
		Database:         "smart-alert",
	}

	connection, err := bongo.Connect(bongoConfig)
	if err != nil {
		log.Fatal(err)
	}

	contractService := service.NewContractService(connection)
	transactionService := service.NewTransactionService(connection)
	triggerService := service.NewTriggerService(connection)
	alertService := service.NewAlertService(connection)

	app := &Application{
		ContractService:    contractService,
		TransactionService: transactionService,
		TriggerService:     triggerService,
		AlertService:       alertService,
	}

	app.Router = NewRouter(app)
	return app
}

func (app *Application) Start() error {
	httpPort := 80

	handler := cors.AllowAll().Handler(app.Router)

	errCh := make(chan error)

	go func() {
		log.Printf("Listening on port %d...", httpPort)
		errCh <- http.ListenAndServe(fmt.Sprintf(":%d", httpPort), handler)
	}()

	listener := l.NewListener(*app.ContractService, *app.TransactionService, *app.TriggerService)
	listener.Listen()

	return <-errCh
}
