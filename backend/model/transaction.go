package model

import (
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/nebojsa94/smart-alert/backend/ethereum"
)

type DecodedArgument struct {
	Soltype abi.Argument
	Value   interface{}
}

type DecodedCallData struct {
	Signature string
	Name      string
	Inputs    []DecodedArgument
}

type ArgumentsUint struct {
	bongo.DocumentBase `bson:",inline"`
	TriggerId          bson.ObjectId
	Position           int `json:"position"`
	Value              int `json:"value"`
}

type ArgumentsString struct {
	bongo.DocumentBase `bson:",inline"`
	TriggerId          bson.ObjectId
	Position           int    `json:"position"`
	Value              string `json:"value"`
}

type Transaction struct {
	bongo.DocumentBase `bson:",inline"`
	Hash               string            `json:"hash"`
	ContractAddress    string            `json:"contract_address"`
	To                 string            `json:"to"`
	From               string            `json:"from"`
	Value              int               `json:"value"`
	InputUint          []ArgumentsUint   `json:"input_uint"`
	InputString        []ArgumentsString `json:"input_string"`
	Ok                 bool              `json:"ok"`
}

func NewTransaction(hash, contractAddress, to, from string, value int, inputsUint []ArgumentsUint, inputsString []ArgumentsString) *Transaction {
	return &Transaction{
		Hash:            hash,
		ContractAddress: contractAddress,
		To:              to,
		From:            from,
		Value:           value,
		InputUint:       inputsUint,
		InputString:     inputsString,
	}
}

type TransactionService interface {
	Create(transaction *Transaction) error
	Get(id string) (*Transaction, error)
	GetAll(contractAddress string) *[]Transaction
	Process(transaction *Transaction, contract *Contract, ok bool) error
	ConvertEthereumTransaction(transaction *ethereum.Transaction, contract *Contract) *Transaction
}
