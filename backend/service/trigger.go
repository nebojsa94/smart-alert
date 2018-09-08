package service

import (
	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/nebojsa94/smart-alert/backend/model"
)

type TriggerService struct {
	c *bongo.Connection
}

func NewTriggerService(c *bongo.Connection) *TriggerService {
	return &TriggerService{c}
}

type Trigger struct {
	bongo.DocumentBase `bson:",inline"`
	ContractAddress    string
	Type               string
	Name               string
	Description        string
	Level              int
	Method             string
}

func (s *TriggerService) Create(trigger *model.Trigger) error {

	triggerMongo := Trigger{
		ContractAddress: trigger.ContractAddress,
		Type:            trigger.Type,
		Name:            trigger.Name,
		Description:     trigger.Description,
		Level:           trigger.Level,
		Method:          trigger.Name,
	}

	err := s.c.Collection("trigger").Save(&triggerMongo)

	for i := range trigger.InputUints {
		trigger.InputUints[i].TriggerId = triggerMongo.Id
		s.c.Collection("triggerInputUint").Save(&trigger.InputUints[i])
	}

	for i := range trigger.InputStrings {
		trigger.InputStrings[i].TriggerId = triggerMongo.Id
		s.c.Collection("triggerInputString").Save(&trigger.InputStrings[i])
	}

	for i := range trigger.OutputUints {
		trigger.OutputUints[i].TriggerId = triggerMongo.Id
		s.c.Collection("triggerOutputUint").Save(&trigger.OutputUints[i])
	}

	for i := range trigger.OutputStrings {
		trigger.OutputStrings[i].TriggerId = triggerMongo.Id
		s.c.Collection("triggerOutputString").Save(&trigger.OutputStrings[i])
	}

	trigger.Id = triggerMongo.Id
	trigger.Created = triggerMongo.Created
	trigger.Modified = triggerMongo.Modified

	return err
}

func (s *TriggerService) Get(id string) (*model.Trigger, error) {
	trigger := &model.Trigger{}
	err := s.c.Collection("trigger").FindOne(bson.M{"_id": bson.ObjectIdHex(id)}, trigger)

	var inputUints []model.ArgumentsUint
	results := s.c.Collection("triggerInputUint").Find(bson.M{"triggerid": bson.ObjectIdHex(id)})

	inputUint := model.ArgumentsUint{}
	for results.Next(&inputUint) {
		inputUints = append(inputUints, inputUint)
	}

	trigger.InputUints = inputUints

	var inputStrings []model.ArgumentsString
	results = s.c.Collection("triggerInputString").Find(bson.M{"triggerid": bson.ObjectIdHex(id)})

	inputString := model.ArgumentsString{}
	for results.Next(&inputString) {
		inputStrings = append(inputStrings, inputString)
	}

	trigger.InputStrings = inputStrings

	var outputUints []model.ArgumentsUint
	results = s.c.Collection("triggerOutputUint").Find(bson.M{"triggerid": id})

	outputUint := model.ArgumentsUint{}
	for results.Next(&outputUint) {
		outputUints = append(outputUints, outputUint)
	}

	trigger.OutputUints = outputUints

	var outputStrings []model.ArgumentsString
	results = s.c.Collection("triggerOutputString").Find(bson.M{"triggerid": id})

	outputString := model.ArgumentsString{}
	for results.Next(&outputString) {
		outputStrings = append(outputStrings, outputString)
	}

	trigger.OutputStrings = outputStrings

	return trigger, err
}

func (s *TriggerService) GetAll(contractAddress string) (*[]model.Trigger, error) {
	var triggers []model.Trigger
	results := s.c.Collection("trigger").Find(bson.M{"contractaddress": contractAddress})

	var trigger model.Trigger
	for results.Next(&trigger) {
		triggerGet, _ := s.Get(trigger.Id.Hex())
		triggers = append(triggers, *triggerGet)
	}

	return &triggers, nil
}
