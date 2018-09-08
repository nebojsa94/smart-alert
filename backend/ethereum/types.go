package ethereum

import (
	"encoding/json"
	"fmt"
	"strconv"
)

// Core Types

type Number int64

func (n *Number) Value() int64 {
	return int64(*n)
}

func (n *Number) Hex() string {
	return fmt.Sprintf("%#x", int64(*n))
}

func (n *Number) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	num, err := strconv.ParseInt(s, 0, 64)
	if err != nil {
		return err
	}

	*n = Number(num)

	return nil
}

type Header struct {
	Number *Number `json:"number"`
}

type Block struct {
	Transactions []*Transaction `json:"transactions"`
}

type Transaction struct {
	Hash string `json:"hash"`

	From        string `json:"from"`
	To          string `json:"to"`
	Input       string `json:"input"`
	Value       int    `json:"value"`
	GasPrice    string `json:"gasPrice"`
	BlockNumber string `json:"blockNumber"`
}

type TransactionReceipt struct {
	From string `json:"from"`
	To   string `json:"to"`

	Status      *Number `json:"status"` // Can be null, if null do a check anyways. 0x0 fail, 0x1 success
	Input       string  `json:"input"`
	Value       int     `json:"value"`
	GasPrice    string  `json:"gasPrice"`
	BlockNumber string  `json:"blockNumber"`
}

// States Types

type TransactionStates interface {
	States() []EvmState
}

type EvmState interface {
	Pc() uint64
	Depth() int
	Op() string
	Stack() []string
}

type GethEvmState struct {
	ValuePc      uint64             `json:"pc"`
	ValueOp      string             `json:"op"`
	ValueGas     uint64             `json:"gas"`
	ValueGasCost int64              `json:"gasCost"`
	ValueDepth   int                `json:"depth"`
	ValueError   json.RawMessage    `json:"error,omitempty"`
	ValueStack   *[]string          `json:"stack,omitempty"`
	ValueMemory  *[]string          `json:"memory,omitempty"`
	ValueStorage *map[string]string `json:"storage,omitempty"`
}

func (s *GethEvmState) Pc() uint64 {
	return s.ValuePc
}

func (s *GethEvmState) Depth() int {
	return s.ValueDepth
}

func (s *GethEvmState) Op() string {
	return s.ValueOp
}

func (s *GethEvmState) Stack() []string {
	return *s.ValueStack
}

type GethTraceResult struct {
	Gas         uint64          `json:"gas"`
	Failed      bool            `json:"failed"`
	ReturnValue string          `json:"returnValue"`
	StructLogs  []*GethEvmState `json:"structLogs"`
}

func (gtr *GethTraceResult) States() []EvmState {
	traces := make([]EvmState, len(gtr.StructLogs))
	for k, v := range gtr.StructLogs {
		traces[k] = v
	}

	return traces
}

// Parity

type ParityVersion struct {
	Major int `json:"major"`
	Minor int `json:"minor"`
	Patch int `json:"patch"`
}

type ParityVersionInfo struct {
	Hash    string        `json:"hash"`
	Track   string        `json:"track"`
	Version ParityVersion `json:"version"`
}

type ParityVmState struct {
	ValuePc    uint64 `json:"pc"`
	Cost       int64  `json:"cost"`
	ValueDepth int    `json:"depth"`
}

func (pvs *ParityVmState) Pc() uint64 {
	return pvs.ValuePc
}

func (pvs *ParityVmState) Depth() int {
	return pvs.ValueDepth
}

func (pvs *ParityVmState) Op() string {
	return "Not implemented"
}

func (pvs *ParityVmState) Stack() []string {
	return []string{"Not implemented"}
}

type ParityTraceResult struct {
	VmTrace *ParityVmTrace `json:"vmTrace"`
}

type ParityVmTrace struct {
	Logs []*ParityVmState `json:"ops"`
}

func (ptr *ParityTraceResult) States() []EvmState {
	traces := make([]EvmState, len(ptr.VmTrace.Logs))
	for k, v := range ptr.VmTrace.Logs {
		traces[k] = v
	}

	return traces
}

// Subscription Types

type SubscriptionID string

func NewNilSubscriptionID() SubscriptionID {
	return ""
}

func (id SubscriptionID) String() string {
	return string(id)
}

type SubscriptionResult struct {
	Subscription SubscriptionID `json:"subscription"`
	Result       Header         `json:"result"`
}

type UnsubscribeSuccess bool
