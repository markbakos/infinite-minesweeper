package controllers

import (
	"context"
	"github.com/markbakos/infinite-minesweeper/server/config"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/markbakos/infinite-minesweeper/server/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"os"
)

func CreateGuestSession(c *gin.Context) {
	guestID := primitive.NewObjectID().Hex()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": guestID,
		"guest":   true,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate guest token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":    tokenString,
		"username": "Guest_" + guestID[0:6],
		"guest":    true,
	})
}

func LogGuestGameRecord(c *gin.Context) {
	var gameRecord models.GameRecord
	if err := c.ShouldBindJSON(&gameRecord); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	gameRecord.PlayedAt = time.Now()

	guestID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Guest ID not found"})
		return
	}

	leaderboardCollection := config.GetCollection("leaderboard")
	record := bson.M{
		"game_type":       gameRecord.GameType,
		"score":           gameRecord.Score,
		"time_in_seconds": gameRecord.TimeInSeconds,
		"played_at":       gameRecord.PlayedAt,
		"guest_id":        guestID.(string),
		"is_guest":        true,
	}

	_, err := leaderboardCollection.InsertOne(context.Background(), record)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed tol save game record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Game record saved successfully"})
}
