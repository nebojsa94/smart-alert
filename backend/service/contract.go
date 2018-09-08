package service

import (
	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/nebojsa94/smart-alert/backend/model"
)

type ContractService struct {
	c *bongo.Connection
}

func NewContractService(c *bongo.Connection) *ContractService {
	return &ContractService{c}
}

func (s *ContractService) Create(contract *model.Contract) error {
	return s.c.Collection("contract").Save(contract)
}

func (s *ContractService) Get(id string) (*model.Contract, error) {
	contract := &model.Contract{}
	err := s.c.Collection("contract").FindOne(bson.M{"address": id}, contract)
	return contract, err
}

func (s *ContractService) GetAll() *[]model.Contract {
	var contracts []model.Contract
	results := s.c.Collection("contract").Find(bson.M{})

	contract := model.Contract{}
	for results.Next(&contract) {
		contracts = append(contracts, contract)
	}

	return &contracts
}
