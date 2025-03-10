package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/markbakos/infinite-minesweeper/server/controllers"
	"github.com/markbakos/infinite-minesweeper/server/middleware"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", controllers.LoginUser)
			auth.POST("/register", controllers.RegisterUser)

			auth.GET("/guest", controllers.CreateGuestSession)
		}

		api.GET("/leaderboard", controllers.GetLeaderboard)
	}

	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/user", controllers.GetCurrentUser)

		game := protected.Group("/game")
		{
			game.POST("/record", controllers.SaveGameRecord)
			game.GET("/records", controllers.GetUserGameRecords)
		}
	}
}
