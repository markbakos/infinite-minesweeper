package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type LeaderboardEntry struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	GameType      string             `bson:"game_type" json:"game_type"`
	Score         int                `bson:"score" json:"score"`
	TimeInSeconds int                `bson:"time_in_seconds" json:"time_in_seconds"`
	PlayedAt      time.Time          `bson:"played_at" json:"played_at"`
	UserID        string             `bson:"user_id,omitempty" json:"user_id,omitempty"`
	Username      string             `bson:"username,omitempty" json:"username,omitempty"`
	GuestID       string             `bson:"guest_id,omitempty" json:"guest_id,omitempty"`
	IsGuest       bool               `bson:"is_guest" json:"is_guest"`
}

type LeaderboardRequest struct {
	GameType string `form:"game_type" binding:"required"`
	Limit    int    `form:"limit,default=10"`
	Skip     int    `form:"skip,default=0"`
}
