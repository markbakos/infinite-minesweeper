package controllers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/stretchr/testify/assert"
)

func TestCreateGuestSession(t *testing.T) {
	gin.SetMode(gin.TestMode)
	os.Setenv("JWT_SECRET", "test-secret-key")

	router := gin.New()
	router.GET("/guest", CreateGuestSession)

	req := httptest.NewRequest(http.MethodGet, "/guest", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var response map[string]interface{}
	err := json.Unmarshal(resp.Body.Bytes(), &response)
	assert.NoError(t, err)

	assert.Contains(t, response, "token")
	assert.Contains(t, response, "username")
	assert.Contains(t, response, "guest")
	assert.True(t, response["guest"].(bool))
	assert.True(t, len(response["username"].(string)) > 0)

	tokenString := response["token"].(string)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte("test-secret-key"), nil
	})

	assert.NoError(t, err)
	assert.True(t, token.Valid)

	claims, ok := token.Claims.(jwt.MapClaims)
	assert.True(t, ok)
	assert.Contains(t, claims, "user_id")
	assert.Contains(t, claims, "guest")
	assert.True(t, claims["guest"].(bool))
	assert.Contains(t, claims, "exp")
}
