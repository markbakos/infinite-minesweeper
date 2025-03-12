package routes

import (
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestSetupRoutes(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	SetupRoutes(router)

	routes := router.Routes()

	expectedRoutes := map[string]string{
		"/api/auth/login":    "POST",
		"/api/auth/register": "POST",
		"/api/auth/guest":    "GET",
		"/api/leaderboard":   "GET",
		"/api/user":          "GET",
		"/api/game/record":   "POST",
		"/api/game/records":  "GET",
	}

	foundRoutes := make(map[string]bool)
	for _, route := range routes {
		path := route.Path
		method := route.Method

		if expectedMethod, exists := expectedRoutes[path]; exists {
			assert.Equal(t, expectedMethod, method, "Method for route %s should be %s", path, expectedMethod)
			foundRoutes[path] = true
		}
	}

	for path := range expectedRoutes {
		assert.True(t, foundRoutes[path], "Expected route %s was not registered", path)
	}
}
