package middleware

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/stretchr/testify/assert"
)

func TestAuthMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	os.Setenv("JWT_SECRET", "test-secret-key")

	tests := []struct {
		name           string
		setupAuth      func(req *http.Request)
		expectedStatus int
		expectedBody   string
		checkUserID    bool
		expectedUserID string
		checkIsGuest   bool
		expectedGuest  bool
	}{
		{
			name: "No Authorization Header",
			setupAuth: func(req *http.Request) {
			},
			expectedStatus: http.StatusUnauthorized,
			expectedBody:   `{"error":"Authorization header is required"}`,
		},
		{
			name: "Invalid Authorization Format",
			setupAuth: func(req *http.Request) {
				req.Header.Set("Authorization", "InvalidFormat token123")
			},
			expectedStatus: http.StatusUnauthorized,
			expectedBody:   `{"error":"Authorization header format must be Bearer {token}"}`,
		},
		{
			name: "Invalid Token",
			setupAuth: func(req *http.Request) {
				req.Header.Set("Authorization", "Bearer invalid.token.here")
			},
			expectedStatus: http.StatusUnauthorized,
			expectedBody:   `{"error":"Invalid token"}`,
		},
		{
			name: "Valid Regular User Token",
			setupAuth: func(req *http.Request) {
				token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
					"user_id": "user123",
					"exp":     time.Now().Add(time.Hour).Unix(),
				})
				tokenString, _ := token.SignedString([]byte("test-secret-key"))
				req.Header.Set("Authorization", "Bearer "+tokenString)
			},
			expectedStatus: http.StatusOK,
			checkUserID:    true,
			expectedUserID: "user123",
			checkIsGuest:   true,
			expectedGuest:  false,
		},
		{
			name: "Valid Guest Token",
			setupAuth: func(req *http.Request) {
				token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
					"user_id": "guest123",
					"guest":   true,
					"exp":     time.Now().Add(time.Hour).Unix(),
				})
				tokenString, _ := token.SignedString([]byte("test-secret-key"))
				req.Header.Set("Authorization", "Bearer "+tokenString)
			},
			expectedStatus: http.StatusOK,
			checkUserID:    true,
			expectedUserID: "guest123",
			checkIsGuest:   true,
			expectedGuest:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			router := gin.New()
			router.Use(AuthMiddleware())

			router.GET("/test", func(c *gin.Context) {
				userID, exists := c.Get("user_id")
				if tt.checkUserID && exists {
					assert.Equal(t, tt.expectedUserID, userID)
				}

				isGuest, exists := c.Get("is_guest")
				if tt.checkIsGuest && exists {
					assert.Equal(t, tt.expectedGuest, isGuest)
				}

				c.Status(http.StatusOK)
			})

			req := httptest.NewRequest(http.MethodGet, "/test", nil)
			tt.setupAuth(req)

			resp := httptest.NewRecorder()
			router.ServeHTTP(resp, req)

			assert.Equal(t, tt.expectedStatus, resp.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, resp.Body.String())
			}
		})
	}

}
