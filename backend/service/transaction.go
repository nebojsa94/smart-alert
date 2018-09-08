package service

import "github.com/go-bongo/bongo"

type TransactionService struct {
	c *bongo.Connection
}

func NewTransactionService(c *bongo.Connection) *TransactionService {
	return &TransactionService{c}
}
