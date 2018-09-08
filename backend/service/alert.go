package service

import "github.com/go-bongo/bongo"

type AlertService struct {
	c *bongo.Connection
}

func NewAlertService(c *bongo.Connection) *AlertService {
	return &AlertService{c}
}
