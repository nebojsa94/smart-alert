package middleware

import (
	"github.com/julienschmidt/httprouter"
)

type Middleware func(handle httprouter.Handle) httprouter.Handle

type Stack []Middleware

func (s Stack) Extend(middleware ...Middleware) Stack {
	return append(s, middleware...)
}

func (s Stack) Do(fn httprouter.Handle) httprouter.Handle {
	if len(s) == 0 {
		return fn
	}

	for i := len(s) - 1; i >= 0; i-- {
		fn = s[i](fn)
	}

	return fn
}
