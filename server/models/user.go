package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type User struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Username    string             `bson:"username" json:"username" binding:"required"`
	Password    string             `bson:"password" json:"-" binding:"required"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
	GameRecords []GameRecord       `bson:"game_records,omitempty" json:"game_records,omitempty"`
}

type GameRecord struct {
	GameType      string    `bson:"game_type" json:"game_type"`
	Score         int       `bson:"score" json:"score"`
	TimeInSeconds int       `bson:"time_in_seconds" json:"time_in_seconds"`
	PlayedAt      time.Time `bson:"played_at" json:"played_at"`
}

type AuthResponse struct {
	Token    string `json:"token"`
	Username string `json:"username"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}
