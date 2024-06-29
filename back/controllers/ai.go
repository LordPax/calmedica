package controllers

import (
	"hackathon/models"
	"hackathon/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sashabaranov/go-openai"
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
	var messages []openai.ChatCompletionMessage
	ws := services.GetWebsocket()
	body, _ := c.MustGet("body").(models.ChatDto)

	nbMessages := len(body.Messages)

	message := models.Message{
		Content: body.Messages[nbMessages-1].Content,
		Phone:   body.Phone,
	}

	if err := message.EvaluateMessage(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := message.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_ = ws.Emit("message:create", message)

	response, err := services.Chat(body.Messages)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	messages = append(body.Messages, response.Choices[0].Message)

	id := 0
	aiResponse := models.Message{
		Content:  response.Choices[0].Message.Content,
		Phone:    body.Phone,
		SenderID: &id,
	}

	if err := aiResponse.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_ = ws.Emit("message:create", aiResponse)

	ouput := map[string]any{
		"messages": messages,
	}

	c.JSON(http.StatusOK, ouput)
}
