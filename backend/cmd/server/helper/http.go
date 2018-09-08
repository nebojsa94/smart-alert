package helper

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type Response map[string]string

func ReadBody(w http.ResponseWriter, r *http.Request, data interface{}) bool {
	err := json.NewDecoder(r.Body).Decode(data)
	if err != nil {
		log.Printf("could not read request: %s", err)

		InternalServerError(w)
		return false
	}

	return true
}

func SendResponse(w http.ResponseWriter, statusCode int, body interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if body == nil {
		return
	}

	data, err := json.Marshal(body)
	if err != nil {
		log.Printf("failed marshaling response: %s", err)

		http.Error(w, "{\"error\": \"Internal Server Error.\"}", http.StatusInternalServerError)
		return
	}

	_, err = io.Copy(w, bytes.NewReader(data))
	if err != nil {
		log.Printf("failed sending response: %s", err)
		return
	}
}

func InternalServerError(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	http.Error(w, fmt.Sprintf("{\"error\":\"%s\"}", http.StatusText(http.StatusInternalServerError)), http.StatusInternalServerError)
}

func BadRequestError(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json")
	http.Error(w, fmt.Sprintf("{\"error\": \"%s\"}", err.Error()), http.StatusBadRequest)
}
