package main

import (
	"log"
)

func main() {
	app := NewApplication()

	err := app.Start()
	if err != nil {
		log.Fatal(err)
	}
}
