package config

import (
	"flag"
	"fmt"
	"github.com/spf13/viper"
)

const (
	HttpPort = "HttpPort"
)

var defaults = map[string]interface{}{
	HttpPort: "80",
}

var configName string

func init() {
	flag.StringVar(&configName, "config", "config", "Configuration file name (without the extension)")
}

func Init() {
	flag.Parse()

	viper.SetConfigName(configName)
	viper.AddConfigPath("$HOME/.smart-alert")
	viper.AddConfigPath(".")

	for k, v := range defaults {
		viper.SetDefault(k, v)
	}

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %s \n", err))
	}
}

func GetBool(key string) bool {
	check(key)

	return viper.GetBool(key)
}

func GetInt(key string) int {
	check(key)

	return viper.GetInt(key)
}

func GetString(key string) string {
	check(key)

	return viper.GetString(key)
}

func check(key string) {
	if !viper.IsSet(key) {
		panic(fmt.Errorf("missing config for key %s", key))
	}
}
