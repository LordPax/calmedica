package controllers

import (
	"hackathon/docs"
	"hackathon/middlewares"
	"hackathon/models"
	"hackathon/utils"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func RegisterRoutes(r *gin.Engine) {
	docs.SwaggerInfo.Title = "UrEsport API"
	docs.SwaggerInfo.Description = "This is a sample server for UrEsport API."
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "fr.uresport.api"
	docs.SwaggerInfo.BasePath = "/v2"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	api := r.Group("/")
	{
		api.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

		users := api.Group("/users")
		{
			users.GET("/",
				middlewares.IsLoggedIn(false),
				middlewares.QueryFilter(),
				GetUsers,
			)
			users.GET("/:user",
				middlewares.IsLoggedIn(true),
				middlewares.Get[*models.User]("user"),
				GetUser,
			)
			users.POST("/:user/image",
				middlewares.IsLoggedIn(true),
				middlewares.Get[*models.User]("user"),
				middlewares.IsMe(),
				middlewares.FileUploader(utils.IMAGE, utils.SIZE_10MB),
				UploadUserImage,
			)
			users.PATCH("/:user",
				middlewares.IsLoggedIn(true),
				middlewares.Get[*models.User]("user"),
				middlewares.IsMe(),
				middlewares.Validate[models.UpdateUserDto](),
				UpdateUser,
			)
			users.DELETE("/:user",
				middlewares.IsLoggedIn(true),
				middlewares.Get[*models.User]("user"),
				middlewares.IsMe(),
				DeleteUser,
			)
			users.GET("/me",
				middlewares.IsLoggedIn(true),
				GetUserMe,
			)
		}

		auth := api.Group("/auth")
		{
			auth.POST("/login",
				middlewares.Validate[models.LoginUserDto](),
				Login,
			)
			auth.POST("/register",
				middlewares.Validate[models.CreateUserDto](),
				Register,
			)
			auth.POST("/logout",
				middlewares.IsLoggedIn(true),
				Logout,
			)
			auth.POST("/refresh", Refresh)
			auth.POST("/verify",
				middlewares.Validate[models.VerifyUserDto](),
				Verify,
			)
			auth.POST("/request-verify",
				middlewares.Validate[models.RequestCodeDto](),
				RequestVerification,
			)
			auth.POST("/request-password-reset",
				middlewares.Validate[models.RequestCodeDto](),
				RequestPasswordReset,
			)
			auth.POST("/reset-password",
				middlewares.Validate[models.ResetPasswordDto](),
				ResetPassword,
			)
		}
	}
}
