package model

import (
	"github.com/go-bongo/bongo"
)

func NewAlert(triggerId, transactionHash string, parameters map[string]string) *Alert {
	return &Alert{
		TriggerId:       triggerId,
		Parameters:      parameters,
		Read:            false,
		TransactionHash: transactionHash,
	}
}

type Alert struct {
	bongo.DocumentBase `bson:",inline"`
	TriggerId          string            `json:"trigger_id"`
	Trigger            Trigger           `json:"trigger"`
	Parameters         map[string]string `json:"parameters"`
	Read               bool              `json:"read"`
	TransactionHash    string            `json:"transactionHash"`
	Transaction        Transaction       `json:"transaction"`
}

type AlertService interface {
	Create(alert *Alert) error
	Get(id string, onlyUnread bool) *[]Alert
	GetAll(contractAddress string, onlyUnread bool) *[]Alert
}
