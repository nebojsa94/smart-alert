package ethereum

import (
	"github.com/nebojsa94/smart-alert/backend/jsonrpc2"
)

var DefaultSchema = Schema{
	Eth:    ethSchema{},
	Net:    netSchema{},
	Trace:  gethTrace{},
	PubSub: pubSubSchema{},
}

var ParitySchema = Schema{
	Eth:    ethSchema{},
	Net:    netSchema{},
	Trace:  parityTrace{},
	PubSub: pubSubSchema{},
}

type Schema struct {
	Eth    EthSchema
	Net    NetSchema
	Trace  TraceSchema
	PubSub PubSubSchema
}

// Eth

type EthSchema interface {
	BlockNumber() (*jsonrpc2.Request, *Number)
	GetBlockByNumber(num Number) (*jsonrpc2.Request, *Block)
	GetTransaction(hash string) (*jsonrpc2.Request, *Transaction)
	GetTransactionReceipt(hash string) (*jsonrpc2.Request, *TransactionReceipt)
}

type ethSchema struct {
}

func (ethSchema) BlockNumber() (*jsonrpc2.Request, *Number) {
	var num Number

	return jsonrpc2.NewRequest("eth_blockNumber"), &num
}

func (ethSchema) GetBlockByNumber(num Number) (*jsonrpc2.Request, *Block) {
	var block Block

	return jsonrpc2.NewRequest("eth_getBlockByNumber", num.Hex(), true), &block
}

func (ethSchema) GetTransaction(hash string) (*jsonrpc2.Request, *Transaction) {
	var t Transaction

	return jsonrpc2.NewRequest("eth_getTransactionByHash", hash), &t
}

func (ethSchema) GetTransactionReceipt(hash string) (*jsonrpc2.Request, *TransactionReceipt) {
	var receipt TransactionReceipt

	return jsonrpc2.NewRequest("eth_getTransactionReceipt", hash), &receipt
}

// Net

type NetSchema interface {
	Version() (*jsonrpc2.Request, *string)
}

type netSchema struct {
}

func (netSchema) Version() (*jsonrpc2.Request, *string) {
	var v string

	return jsonrpc2.NewRequest("net_version"), &v
}

// States

type TraceSchema interface {
	Trace(hash string) (*jsonrpc2.Request, TransactionStates)
}

type gethTrace struct {
}

func (gethTrace) Trace(hash string) (*jsonrpc2.Request, TransactionStates) {
	var trace GethTraceResult

	return jsonrpc2.NewRequest("debug_traceTransaction", hash, struct{}{}), &trace
}

type parityTrace struct {
}

func (parityTrace) Trace(hash string) (*jsonrpc2.Request, TransactionStates) {
	var trace ParityTraceResult

	return jsonrpc2.NewRequest("trace_replayTransaction", hash, []string{"vmTrace"}), &trace
}

// PubSub

type PubSubSchema interface {
	Subscribe() (*jsonrpc2.Request, *SubscriptionID)
	Unsubscribe(id SubscriptionID) (*jsonrpc2.Request, *UnsubscribeSuccess)
}

type pubSubSchema struct {
}

func (pubSubSchema) Subscribe() (*jsonrpc2.Request, *SubscriptionID) {
	id := NewNilSubscriptionID()

	return jsonrpc2.NewRequest("eth_subscribe", "newHeads"), &id
}

func (pubSubSchema) Unsubscribe(id SubscriptionID) (*jsonrpc2.Request, *UnsubscribeSuccess) {
	var success UnsubscribeSuccess

	return jsonrpc2.NewRequest("eth_unsubscribe", id.String()), &success
}
