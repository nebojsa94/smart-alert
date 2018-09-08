package service

import "github.com/go-bongo/bongo"

type TriggerService struct {
	c *bongo.Connection
}

func NewTriggerService(c *bongo.Connection) *TriggerService {
	return &TriggerService{c}
}
