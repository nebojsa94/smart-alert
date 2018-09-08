package model

import (
	"github.com/go-bongo/bongo"
	"time"
)

type Contract struct {
	bongo.DocumentBase `bson:",inline"`
	Id                 string
	Name               string
	Address            string
	Abi                string
	CreatedAt          time.Time
}

func NewContract(name, address, abi string) *Contract {
	return &Contract{
		Name:      name,
		Address:   address,
		Abi:       abi,
		CreatedAt: time.Now(),
	}
}

type ContractService interface {
	Create(contract *Contract) error
	Get(Id string) (*Contract, error)
	GetAll() *[]Contract
}
