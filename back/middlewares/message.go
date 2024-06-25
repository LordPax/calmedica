package middlewares

import (
	"hackathon/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func IsMessageSender() gin.HandlerFunc {
	return func(c *gin.Context) {
		image, _ := c.MustGet("image").(*models.Message)
		connectedUser, _ := c.MustGet("connectedUser").(models.User)

		if image.SenderID != &connectedUser.ID && !connectedUser.IsRole(models.ROLE_ADMIN) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		c.Next()
	}
}
