package model

import (
	"github.com/go-bongo/bongo"
	"time"
)

type Alert struct {
	bongo.DocumentBase `bson:",inline"`
	Id                 string
	TriggerId          int
	CreatedAt          time.Time
}
