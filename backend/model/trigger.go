package model

import "github.com/go-bongo/bongo"

type Trigger struct {
	bongo.DocumentBase `bson:",inline"`
	Id                 int
	ContractId         int
	Type               string
	Parameters         map[string]interface{}
}
