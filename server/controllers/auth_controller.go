package controllers

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/markbakos/infinite-minesweeper/server/config"
	"github.com/markbakos/infinite-minesweeper/server/models"
	"github.com/markbakos/infinite-minesweeper/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func getUserCollection() *mongo.Collection {
	return config.GetCollection("users")
}

func RegisterUser(c *gin.Context) {
	var request models.RegisterRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userCollection := getUserCollection()

	var existingUser models.User
	err := userCollection.FindOne(context.Background(), bson.M{"username": request.Username}).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with this username already exists"})
		return
	}

	hashedPassword, err := utils.HashPassword(request.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	now := time.Now()
	newUser := models.User{
		ID:        primitive.NewObjectID(),
		Username:  request.Username,
		Password:  hashedPassword,
		CreatedAt: now,
		UpdatedAt: now,
	}

	_, err = userCollection.InsertOne(context.Background(), newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	token, err := generateToken(newUser.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Generate token"})
		return
	}

	c.JSON(http.StatusCreated, models.AuthResponse{
		Token:    token,
		Username: newUser.Username,
	})
}

func LoginUser(c *gin.Context) {
	var request models.LoginRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userCollection := getUserCollection()

	var user models.User
	err := userCollection.FindOne(context.Background(), bson.M{"username": request.Username}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if !utils.CheckPasswordHash(request.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	token, err := generateToken(user.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Token:    token,
		Username: user.Username,
	})
}

func generateToken(userID string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func GetCurrentUser(c *gin.Context) {
	userID, _ := c.Get("user_id")
	objectID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	userCollection := getUserCollection()

	var user models.User
	err = userCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":       user.ID,
		"username": user.Username,
	})
}
