package model

import "github.com/go-bongo/bongo"

type Transaction struct {
	bongo.DocumentBase `bson:",inline"`
	Hash               string
	ContractId         int
	To                 string
	From               string
	Value              int
	Input              map[string]interface{}
}
