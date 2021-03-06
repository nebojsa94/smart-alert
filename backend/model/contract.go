package model

import (
	"github.com/go-bongo/bongo"
)

type Contract struct {
	bongo.DocumentBase `bson:",inline"`
	Name               string `json:"name"`
	Address            string `json:"address"`
	Abi                string `json:"abi"`
	BlockNumber        int    `json:"blockNumber"`
}

func NewContract(name, address, abi string, blockNumber int) *Contract {
	return &Contract{
		Name:        name,
		Address:     address,
		Abi:         abi,
		BlockNumber: blockNumber,
	}
}

type ContractService interface {
	Create(contract *Contract) error
	Get(Id string) (*Contract, error)
	GetAll() *[]Contract
}
