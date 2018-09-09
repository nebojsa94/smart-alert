package service

import (
	"bytes"
	"encoding/gob"
	"encoding/hex"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/nebojsa94/smart-alert/backend/ethereum"
	"github.com/nebojsa94/smart-alert/backend/model"
	"math/big"
	"strings"
)

type TransactionService struct {
	c *bongo.Connection
}

type Transaction struct {
	bongo.DocumentBase `bson:",inline"`
	Hash               string
	ContractAddress    string
	To                 string
	From               string
	Value              int
	Ok                 bool
	GasPrice           string `json:"gasPrice"`
	BlockNumber        string `json:"blockNumber"`
}

func NewTransactionService(c *bongo.Connection) *TransactionService {
	return &TransactionService{c}
}

func (s *TransactionService) Create(transaction *model.Transaction) error {
	for _, transactionUint := range transaction.InputUint {
		s.c.Collection("transactionUint").Save(&transactionUint)
	}

	for _, transactionString := range transaction.InputString {
		s.c.Collection("transactionString").Save(&transactionString)
	}

	return s.c.Collection("transaction").Save(&Transaction{
		Hash:            transaction.Hash,
		ContractAddress: transaction.ContractAddress,
		To:              transaction.To,
		From:            transaction.From,
		Value:           transaction.Value,
		Ok:              transaction.Ok,
	})
}

func (s *TransactionService) Get(hash string) (*model.Transaction, error) {
	transaction := &model.Transaction{}
	err := s.c.Collection("transaction").FindOne(bson.M{"hash": hash}, transaction)

	var transactionsUint []model.ArgumentsUint
	results := s.c.Collection("transactionUint").Find(bson.M{"hash": transaction.Hash})

	transactionUint := model.ArgumentsUint{}
	for results.Next(&transactionUint) {
		transactionsUint = append(transactionsUint, transactionUint)
	}

	transaction.InputUint = transactionsUint

	var transactionsString []model.ArgumentsString
	results = s.c.Collection("transactionString").Find(bson.M{"hash": transaction.Hash})

	transactionString := model.ArgumentsString{}
	for results.Next(&transactionString) {
		transactionsString = append(transactionsString, transactionString)
	}

	transaction.InputString = transactionsString

	return transaction, err
}

func (s *TransactionService) GetAll(contractAddress string) *[]model.Transaction {
	var transactions []model.Transaction
	results := s.c.Collection("transaction").Find(bson.M{})

	transaction := model.Transaction{}
	for results.Next(&transaction) {
		transactions = append(transactions, transaction)
	}

	return &transactions
}

func (s *TransactionService) ConvertEthereumTransaction(transaction *ethereum.Transaction, contract *model.Contract) (*model.Transaction, error) {
	decodeInput, _ := hex.DecodeString(transaction.Input[2:])
	decodedData, err := ParseCallData(decodeInput, contract.Abi)
	if err != nil {
		fmt.Print("Unable to decode data")
		return nil, err
	}

	var transactionsUint []model.ArgumentsUint
	var transactionsString []model.ArgumentsString

	for position, value := range decodedData.Inputs {
		if value.Soltype.Type.String() == "uint256" {
			transactionsUint = append(transactionsUint, model.ArgumentsUint{
				Position: position,
				Value:    int(value.Value.(*big.Int).Int64()),
			})
		}

		if value.Soltype.Type.String() == "string" {
			transactionsString = append(transactionsString, model.ArgumentsString{
				Position: position,
				Value:    value.Value.(string),
			})
		}
	}

	return model.NewTransaction(transaction.Hash, contract.Address, transaction.To, transaction.From, transaction.Value, transactionsUint, transactionsString), nil
}

func (s *TransactionService) Process(transaction *model.Transaction, contract *model.Contract, ok bool) error {
	transaction.Ok = ok

	return s.Create(transaction)
}

func ParseCallData(calldata []byte, abidata string) (*model.DecodedCallData, error) {

	if len(calldata) < 4 {
		return nil, fmt.Errorf("Invalid ABI-data, incomplete method signature of (%d bytes)", len(calldata))
	}

	sigdata, argdata := calldata[:4], calldata[4:]
	if len(argdata)%32 != 0 {
		return nil, fmt.Errorf("Not ABI-encoded data; length should be a multiple of 32 (was %d)", len(argdata))
	}

	abispec, err := abi.JSON(strings.NewReader(abidata))
	if err != nil {
		return nil, fmt.Errorf("Failed parsing JSON ABI: %v, abidata: %v", err, abidata)
	}

	method, err := abispec.MethodById(sigdata)
	if err != nil {
		return nil, err
	}

	v, err := method.Inputs.UnpackValues(argdata)
	if err != nil {
		return nil, err
	}

	decoded := model.DecodedCallData{Signature: method.Sig(), Name: method.Name}

	for n, transaction := range method.Inputs {
		if err != nil {
			return nil, fmt.Errorf("Failed to decode transaction %d (signature %v): %v", n, method.Sig(), err)
		}
		decodedArg := model.DecodedArgument{
			Soltype: transaction,
			Value:   v[n],
		}
		decoded.Inputs = append(decoded.Inputs, decodedArg)
	}

	// We're finished decoding the data. At this point, we encode the decoded data to see if it matches with the
	// original data. If we didn't do that, it would e.g. be possible to stuff extra data into the transactions, which
	// is not detected by merely decoding the data.

	var (
		encoded []byte
	)
	encoded, err = method.Inputs.PackValues(v)

	if err != nil {
		return nil, err
	}

	if !bytes.Equal(encoded, argdata) {
		was := common.Bytes2Hex(encoded)
		exp := common.Bytes2Hex(argdata)
		return nil, fmt.Errorf("WARNING: Supplied data is stuffed with extra data. \nWant %s\nHave %s\nfor method %v", exp, was, method.Sig())
	}
	return &decoded, nil
}

func MethodById(abi *abi.ABI, sigdata []byte) (*abi.Method, error) {
	for _, method := range abi.Methods {
		if bytes.Equal(method.Id(), sigdata[:4]) {
			return &method, nil
		}
	}
	return nil, fmt.Errorf("no method with id: %#x", sigdata[:4])
}

func getBytes(key interface{}) ([]byte, error) {
	var buf bytes.Buffer
	enc := gob.NewEncoder(&buf)
	err := enc.Encode(key)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}
