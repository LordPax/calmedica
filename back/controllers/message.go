package controllers

import (
	"hackathon/models"
	"hackathon/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetMessage godoc
//
// @Summary		get message by id
// @Description	get message by id
// @Tags			message
// @Accept			json
// @Produce		json
// @Param			id	path		int	true	"Message ID"
// @Success		200	{object}	models.Message
// @Failure		404	{object}	utils.HttpError
// @Failure		500	{object}	utils.HttpError
// @Router			/messages/{id} [get]
func GetMessage(c *gin.Context) {
	message, _ := c.MustGet("message").(*models.Message)
	c.JSON(http.StatusOK, message)
}

// GetMessages godoc
//
// @Summary		get all messages
// @Description	get all messages
// @Tags			message
// @Accept			json
// @Produce		json
// @Success		200	{object}	[]models.Message
// @Failure		500	{object}	utils.HttpError
// @Router			/messages/ [get]
func GetMessages(c *gin.Context) {
	query, _ := c.MustGet("query").(services.QueryFilter)

	messages, err := models.FindAllMessage(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, messages)
}

// GetMessagesByUser godoc
//
// @Summary		get all messages
// @Description	get all messages
// @Tags			message
// @Accept			json
// @Produce		json
// @Param			user	path	int	true	"User ID"
// @Success		200	{object}	[]models.Message
// @Failure		500	{object}	utils.HttpError
// @Router			/users/{user}/messages [get]
func GetMessagesByUser(c *gin.Context) {
	user, _ := c.MustGet("user").(*models.User)

	messages, err := models.FindMessages("sender_id", user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, messages)
}

// GetMessagesByPhone godoc
//
// @Summary		get all messages by phone
// @Description	get all messages by phone
// @Tags			message
// @Accept			json
// @Produce		json
// @Param			phone	path	int	true	"Phone"
// @Success		200		{object}	[]models.Message
// @Failure		404		{object}	utils.HttpError
// @Failure		500		{object}	utils.HttpError
// @Router			/messages/phone/{phone} [get]
func GetMessagesByPhone(c *gin.Context) {
	phone := c.Param("phone")
	if phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Phone is required"})
		return
	}

	messages, err := models.FindMessages("phone", phone)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, messages)
}

// CreateMessage godoc
//
// @Summary		create message
// @Description	create message
// @Tags			message
// @Accept			json
// @Produce		json
// @Param			message	body	models.CreateMessageDto	true	"Message"
// @Success		201	{object}	models.Message
// @Failure		400	{object}	utils.HttpError
// @Failure		500	{object}	utils.HttpError
// @Router			/messages/ [post]
func CreateMessage(c *gin.Context) {
	body, _ := c.MustGet("body").(models.CreateMessageDto)
	connectedUser, userOk := c.Get("connectedUser")
	files, fileOk := c.Get("files")

	message := models.Message{
		Content: body.Content,
		Phone:   body.Phone,
	}

	if fileOk {
		message.Attachments = append(message.Attachments, files.([]string)...)
	}

	if userOk {
		connectedUser, _ := connectedUser.(models.User)
		message.SenderID = &connectedUser.ID
	}

	if err := message.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(message.Attachments) > 0 {
		go sendAiRequest(message)
	}

	c.JSON(http.StatusCreated, message)
}

func sendAiRequest(message models.Message) {
	ws := services.GetWebsocket()
	gptMessage := services.AddImageToChat(message.Attachments, "décris cette image")
	resp, err := services.Chat(gptMessage)
	if err != nil {
		return
	}

	message.AiResponse = resp.Choices[0].Message.Content

	if message.Save() != nil {
		return
	}

	_ = ws.Emit("message", message)
}

// UpdateMessage godoc
//
// @Summary		update message
// @Description	update message
// @Tags			message
// @Accept			json
// @Produce		json
// @Param			message	body	models.UpdateMessageDto	true	"Message"
// @Param			id		path	int						true	"Message ID"
// @Success		200		{object}	models.Message
// @Failure		400		{object}	utils.HttpError
// @Failure		500		{object}	utils.HttpError
// @Router			/messages/{id} [put]
func UpdateMessage(c *gin.Context) {
	body, _ := c.MustGet("body").(models.UpdateMessageDto)
	message, _ := c.MustGet("message").(*models.Message)

	if body.Content != "" {
		message.Content = body.Content
	}

	if err := message.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, message)
}

// DeleteMessage godoc
//
// @Summary		delete message
// @Description	delete message
// @Tags			message
// @Accept			json
// @Produce		json
// @Param			id	path	int	true	"Message ID"
// @Success		204	{object}	models.Message
// @Failure		404	{object}	utils.HttpError
// @Failure		500	{object}	utils.HttpError
// @Router			/messages/{id} [delete]
func DeleteMessage(c *gin.Context) {
	message, _ := c.MustGet("message").(*models.Message)

	if err := message.Delete(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
