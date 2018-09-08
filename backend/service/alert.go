package service

import (
	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/nebojsa94/smart-alert/backend/model"
)

type AlertService struct {
	c *bongo.Connection
}

func NewAlertService(c *bongo.Connection) *AlertService {
	return &AlertService{c}
}

func (s *AlertService) Create(alert *model.Alert) error {
	return s.c.Collection("alert").Save(alert)
}

func (s *AlertService) Get(triggerId string, onlyUnread bool) *[]model.Alert {
	var alerts []model.Alert

	rule := bson.M{"triggerid": triggerId}
	if onlyUnread {
		rule["read"] = false
	}

	results := s.c.Collection("alert").Find(rule)

	alert := model.Alert{}
	for results.Next(&alert) {
		s.c.Collection("transaction").FindOne(bson.M{"hash": alert.TransactionHash}, &alert.Transaction)
		s.c.Collection("trigger").FindOne(bson.M{"_id": bson.ObjectIdHex(alert.TriggerId)}, &alert.Trigger)
		alerts = append(alerts, alert)
		if onlyUnread {
			alert.Read = true
			s.Create(&alert)
		}
	}

	return &alerts
}

func (s *AlertService) GetAll(contractAddress string, onlyUnread bool) *[]model.Alert {
	var triggers []model.Trigger
	results := s.c.Collection("trigger").Find(bson.M{"contractaddress": contractAddress})

	trigger := model.Trigger{}
	for results.Next(&trigger) {
		triggers = append(triggers, trigger)
	}

	var alerts []model.Alert
	for _, trigger := range triggers {
		alerts = append(alerts, *s.Get(trigger.Id.Hex(), onlyUnread)...)
	}

	return &alerts
}
