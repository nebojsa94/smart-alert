package ethereum

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/nebojsa94/smart-alert/backend/jsonrpc2"
)

// Client represents an implementation agnostic interface to the Ethereum node.
// It is able connect to both different protocols (http, ws) and implementations (geth, parity).
type Client struct {
	rpc    *jsonrpc2.Client
	schema Schema

	openChannels []chan int64
}

func Dial(host string) (*Client, error) {
	rpcClient, err := jsonrpc2.DiscoverAndDial(host)
	if err != nil {
		return nil, fmt.Errorf("dial ethereum rpc: %s", err)
	}

	schema := DefaultSchema

	var parityVersionInfo ParityVersionInfo
	if err = rpcClient.Call(&parityVersionInfo, "parity_versionInfo"); err == nil {
		// We are talking to a parity node.
		log.Printf("Using parity RPC Schema...")

		schema = ParitySchema
	}

	return &Client{
		rpc:    rpcClient,
		schema: schema,
	}, nil
}

func (c *Client) CurrentBlockNumber() (int64, error) {
	req, resp := c.schema.Eth.BlockNumber()

	err := c.rpc.CallRequest(resp, req)
	if err != nil {
		return 0, fmt.Errorf("current block number: %s", err)
	}

	return resp.Value(), nil
}

func (c *Client) GetBlock(number int64) (*Block, error) {
	req, resp := c.schema.Eth.GetBlockByNumber(Number(number))

	if err := c.rpc.CallRequest(resp, req); err != nil {
		return nil, fmt.Errorf("get block by number [%d]: %s", number, err)
	}

	return resp, nil
}

func (c *Client) GetTransaction(hash string) (*Transaction, error) {
	req, resp := c.schema.Eth.GetTransaction(hash)

	if err := c.rpc.CallRequest(resp, req); err != nil {
		return nil, fmt.Errorf("get transaction [%s]: %s", hash, err)
	}

	return resp, nil
}

func (c *Client) GetTransactionReceipt(hash string) (*TransactionReceipt, error) {
	req, resp := c.schema.Eth.GetTransactionReceipt(hash)

	if err := c.rpc.CallRequest(resp, req); err != nil {
		return nil, fmt.Errorf("get transaction receipt [%s]: %s", hash, err)
	}

	return resp, nil
}

func (c *Client) GetNetworkID() (string, error) {
	req, resp := c.schema.Net.Version()

	if err := c.rpc.CallRequest(resp, req); err != nil {
		return "", fmt.Errorf("get network ID: %s", err)
	}

	return *resp, nil
}

func (c *Client) GetTransactionTrace(hash string) (TransactionStates, error) {
	req, resp := c.schema.Trace.Trace(hash)

	if err := c.rpc.CallRequest(resp, req); err != nil {
		return nil, fmt.Errorf("get transaction trace [%s]: %s", hash, err)
	}

	return resp, nil
}

func (c *Client) Subscribe() (chan int64, error) {
	req, subscription := c.schema.PubSub.Subscribe()
	err := c.rpc.CallRequest(subscription, req)
	if err != nil {
		log.Printf("Subscription not supported, falling back to polling")
		return c.subscribeViaPoll()
	}

	return c.subscribe(subscription)
}

func (c *Client) subscribeViaPoll() (chan int64, error) {
	outCh := make(chan int64)

	go func() {
		var lastBlock int64

		for {
			blockNumber, err := c.CurrentBlockNumber()
			if err != nil {
				log.Printf("failed pollig for last block number: %s", err)
				time.Sleep(1 * time.Second)
				continue
			}

			if lastBlock == 0 {
				lastBlock = blockNumber
				continue
			}

			for lastBlock < blockNumber {
				outCh <- blockNumber

				lastBlock++
			}

			time.Sleep(200 * time.Millisecond)
		}
	}()

	return outCh, nil
}

func (c *Client) subscribe(id *SubscriptionID) (chan int64, error) {
	outCh := make(chan int64)

	inCh, err := c.rpc.Subscribe(id.String())
	if err != nil {
		return nil, fmt.Errorf("listen for subscriptions: %s", err)
	}

	go func() {
		for msg := range inCh {
			var resp SubscriptionResult
			err = json.Unmarshal(msg.Params, &resp)
			if err != nil {
				log.Printf("failed reading notification: %s", err)
				continue
			}

			outCh <- resp.Result.Number.Value()
		}

		close(outCh)
	}()

	return outCh, nil
}

func (c *Client) Close() error {
	c.rpc.Close()

	return nil
}
