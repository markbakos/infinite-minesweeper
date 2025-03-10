package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
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

type LeaderboardResponse struct {
	Entries  []LeaderboardEntry `json:"entries"`
	Total    int64              `json:"total"`
	GameType string             `json:"game_type"`
	Page     int                `json:"page"`
	Limit    int                `json:"limit"`
}

type LeaderboardStats struct {
	TotalPlayers      int    `json:"total_players"`
	RegisteredPlayers int    `json:"registered_players"`
	GuestPlayers      int    `json:"guest_players"`
	HighestScore      int    `json:"highest_score"`
	AverageScore      int    `json:"average_score"`
	GameType          string `json:"game_type"`
}
