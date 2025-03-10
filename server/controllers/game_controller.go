package controllers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/markbakos/infinite-minesweeper/server/config"
	"github.com/markbakos/infinite-minesweeper/server/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func SaveGameRecord(c *gin.Context) {
	var gameRecord models.GameRecord

	if err := c.ShouldBindJSON(&gameRecord); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if gameRecord.GameType != "normal" && gameRecord.GameType != "infinite" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Game type must be normal or infinite"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found"})
		return
	}

	isGuest, _ := c.Get("is_guest")

	gameRecord.PlayedAt = time.Now()

	leaderboardCollection := config.GetCollection("leaderboard")

	if isGuest == true {
		var existingEntry models.LeaderboardEntry
		filter := bson.M{"guest_id": userID.(string), "game_type": gameRecord.GameType, "is_guest": true}

		err := leaderboardCollection.FindOne(context.Background(), filter).Decode(&existingEntry)

		if err == nil {
			if gameRecord.Score > existingEntry.Score {
				update := bson.M{
					"$set": bson.M{
						"score":           gameRecord.Score,
						"time_in_seconds": gameRecord.TimeInSeconds,
						"played_at":       gameRecord.PlayedAt,
					},
				}

				_, err = leaderboardCollection.UpdateOne(context.Background(), filter, update)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update guest game record"})
					return
				}
			}
		} else {
			leaderboardEntry := models.LeaderboardEntry{
				ID:            primitive.NewObjectID(),
				GameType:      gameRecord.GameType,
				Score:         gameRecord.Score,
				TimeInSeconds: gameRecord.TimeInSeconds,
				PlayedAt:      gameRecord.PlayedAt,
				GuestID:       userID.(string),
				Username:      "Guest_" + userID.(string)[0:6],
				IsGuest:       true,
			}

			_, err = leaderboardCollection.InsertOne(context.Background(), leaderboardEntry)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save guest game record"})
				return
			}
		}
	} else {
		userCollection := getUserCollection()
		objectID, err := primitive.ObjectIDFromHex(userID.(string))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		var user models.User
		err = userCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		var updatedRecords []models.GameRecord
		var shouldUpdateLeaderboard = false
		var existingRecordForGameType = false

		for _, record := range user.GameRecords {
			if record.GameType != gameRecord.GameType {
				updatedRecords = append(updatedRecords, record)
			} else {
				existingRecordForGameType = true
				if gameRecord.Score > record.Score {
					updatedRecords = append(updatedRecords, gameRecord)
					shouldUpdateLeaderboard = true
				} else {
					updatedRecords = append(updatedRecords, record)
				}
			}
		}

		if !existingRecordForGameType {
			updatedRecords = append(updatedRecords, gameRecord)
			shouldUpdateLeaderboard = true
		}

		_, err = userCollection.UpdateOne(
			context.Background(),
			bson.M{"_id": objectID},
			bson.M{"$set": bson.M{"game_records": updatedRecords}},
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user's game records"})
			return
		}

		if shouldUpdateLeaderboard {
			filter := bson.M{"user_id": objectID.Hex(), "game_type": gameRecord.GameType, "is_guest": false}
			var existingLeaderboardEntry models.LeaderboardEntry

			err = leaderboardCollection.FindOne(context.Background(), filter).Decode(&existingLeaderboardEntry)

			if err == nil {
				update := bson.M{
					"$set": bson.M{
						"score":           gameRecord.Score,
						"time_in_seconds": gameRecord.TimeInSeconds,
						"played_at":       gameRecord.PlayedAt,
					},
				}

				_, err = leaderboardCollection.UpdateOne(context.Background(), filter, update)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update leaderboard entry"})
					return
				}
			} else {
				leaderboardEntry := models.LeaderboardEntry{
					ID:            primitive.NewObjectID(),
					GameType:      gameRecord.GameType,
					Score:         gameRecord.Score,
					TimeInSeconds: gameRecord.TimeInSeconds,
					PlayedAt:      gameRecord.PlayedAt,
					UserID:        objectID.Hex(),
					Username:      user.Username,
					IsGuest:       false,
				}

				_, err = leaderboardCollection.InsertOne(context.Background(), leaderboardEntry)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save game record to leaderboard"})
					return
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Game record saved successfully"})
}

func GetUserGameRecords(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found"})
		return
	}

	isGuest, _ := c.Get("is_guest")
	if isGuest == true {
		gameType := c.Query("gameType")
		leaderboardCollection := config.GetCollection("leaderboard")

		filter := bson.M{"guest_id": userID.(string), "is_guest": true}
		if gameType != "" {
			filter["game_type"] = gameType
		}

		cursor, err := leaderboardCollection.Find(context.Background(), filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve guest records"})
			return
		}
		defer cursor.Close(context.Background())

		var records []models.LeaderboardEntry
		if err := cursor.All(context.Background(), &records); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode guest records"})
			return
		}

		var gameRecords []models.GameRecord
		for _, record := range records {
			gameRecords = append(gameRecords, models.GameRecord{
				GameType:      record.GameType,
				Score:         record.Score,
				TimeInSeconds: record.TimeInSeconds,
				PlayedAt:      record.PlayedAt,
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"records": gameRecords,
		})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User ID"})
		return
	}

	userCollection := getUserCollection()

	var user models.User
	err = userCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	gameType := c.Query("gameType")
	var filteredRecords []models.GameRecord

	if gameType != "" {
		for _, record := range user.GameRecords {
			if record.GameType == gameType {
				filteredRecords = append(filteredRecords, record)
			}
		}
	} else {
		filteredRecords = user.GameRecords
	}

	c.JSON(http.StatusOK, gin.H{
		"records": filteredRecords,
	})
}

func GetLeaderboard(c *gin.Context) {
	gameType := c.Query("gameType")
	if gameType == "" {
		gameType = "normal"
	}

	limit := 10
	if limitParam := c.Query("limit"); limitParam != "" {
		if val, err := strconv.ParseInt(limitParam, 10, 64); err == nil {
			limit = int(val)
		}
	}

	skip := 0
	if skipParam := c.Query("skip"); skipParam != "" {
		if val, err := strconv.ParseInt(skipParam, 10, 64); err == nil {
			skip = int(val)
		}
	}

	leaderboardCollection := config.GetCollection("leaderboard")

	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "score", Value: -1}})
	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(skip))

	cursor, err := leaderboardCollection.Find(
		context.Background(),
		bson.M{"game_type": gameType},
		findOptions,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve leaderboard"})
		return
	}
	defer cursor.Close(context.Background())

	var leaderboard []models.LeaderboardEntry
	if err := cursor.All(context.Background(), &leaderboard); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode leaderboard entries"})
		return
	}

	totalCount, err := leaderboardCollection.CountDocuments(
		context.Background(),
		bson.M{"game_type": gameType},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count leaderboard entries"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"leaderboard": leaderboard,
		"total":       totalCount,
		"game_type":   gameType,
	})
}
