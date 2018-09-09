package model

import "github.com/go-bongo/bongo"

const (
	WithdrawCalled         = "WITHDRAW_CALLED"
	NonAuthorizedWithdraw  = "NON_AUTHORIZED_WITHDRAW"
	HighFailedTransactions = "HIGH_FAILED_TRANSACTIONS"
	InvalidContractMethod  = "INVALID_CONTRACT_METHOD"
	ContractCalling        = "CONTRACT_CALLING"
	BlockFilling           = "BLOCK_FILLING"
	ValidateIpfs           = "VALIDATE_IPFS"
	HighGasPrice           = "HIGH_GAS_PRICE"
	InputCriteria          = "INPUT_CRITERIA"
)

type Trigger struct {
	bongo.DocumentBase `bson:",inline"`
	ContractAddress    string            `json:"contractAddress"`
	Type               string            `json:"type"`
	Name               string            `json:"name"`
	Description        string            `json:"description"`
	Level              int               `json:"level"`
	Method             string            `json:"method"`
	InputUints         []ArgumentsUint   `json:"inputUints"`
	InputStrings       []ArgumentsString `json:"inputStrings"`
	OutputUints        []ArgumentsUint   `json:"outputUints"`
	OutputStrings      []ArgumentsString `json:"outputStrings"`
}

func NewTrigger(contractAddress, Type, name, description string, level int, method string, inputUint []ArgumentsUint, inputString []ArgumentsString, outputUint []ArgumentsUint, outputString []ArgumentsString) *Trigger {
	return &Trigger{
		ContractAddress: contractAddress,
		Type:            Type,
		Name:            name,
		Description:     description,
		Level:           level,
		Method:          method,
		InputUints:      inputUint,
		InputStrings:    inputString,
		OutputUints:     outputUint,
		OutputStrings:   outputString,
	}
}

type TriggerService interface {
	Create(trigger *Trigger) error
	Get(id string) (*Trigger, error)
	GetAll(contractAddress string) (*[]Trigger, error)
}
