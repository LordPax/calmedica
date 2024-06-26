package controllers

import (
	"hackathon/models"
	"hackathon/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Chat godoc
//
// @Summary		chat with AI
// @Description	chat with AI
// @Tags			ai
// @Accept			json
// @Produce		json
// @Param			body	body	models.ChatDto	true	"ChatDto"
// @Success		200
// @Failure		400	{object}	utils.HttpError
// @Failure		500	{object}	utils.HttpError
// @Router			/ai/chat [post]
func ChatMessage(c *gin.Context) {
	body, _ := c.MustGet("body").(models.ChatDto)

	response, err := services.Chat(body.Messages)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}
