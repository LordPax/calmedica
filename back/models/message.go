package models

import (
	"hackathon/services"
	"time"

	"github.com/sashabaranov/go-openai"
)

type Message struct {
	ID              int       `json:"id" gorm:"primaryKey"`
	Content         string    `json:"content" gorm:"type:text"`
	SenderID        *int      `json:"sender_id"`
	Phone           string    `json:"phone" gorm:"type:varchar(30)"`
	Attachments     []string  `json:"attachment" gorm:"json"`
	AiResponse      string    `json:"ai_response" gorm:"type:text"`
	ImagesSentiment string    `json:"images_sentiment" gorm:"type:text"`
	Sentiment       string    `json:"sentiment" gorm:"type:varchar(30)"`
	SentimentRate   float64   `json:"sentiment_rate"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type CreateMessageDto struct {
	Content string `json:"content" form:"content" validate:"required"`
	Phone   string `json:"phone" form:"phone" validate:"required"`
}

type UpdateMessageDto struct {
	Content string `json:"content" form:"content"`
}

type ChatDto struct {
	Phone    string                         `json:"phone" validate:"required"`
	Messages []openai.ChatCompletionMessage `json:"messages" validate:"required"`
}

func FindAllMessage(query services.QueryFilter) ([]Message, error) {
	var messages []Message

	err := DB.Model(&Message{}).
		Where(query.GetWhere()).
		Find(&messages).Error

	return messages, err
}

func FindMessages(name string, value any) ([]Message, error) {
	var messages []Message

	err := DB.Model(&Message{}).
		Where(name, value).
		Find(&messages).Error

	return messages, err
}

func (m *Message) EvaluateMessage() error {
	evaluation, err := services.EvaluateNegativity(m.Content)
	if err != nil {
		return err
	}

	m.Sentiment = evaluation["amazon"].GeneralSentiment
	m.SentimentRate = evaluation["amazon"].GeneralSentimentRate

	return nil
}

func (m *Message) FindOneById(id int) error {
	return DB.Model(&Message{}).
		First(&m, id).Error
}

func (m *Message) FindOne(key string, value any) error {
	return DB.Model(&Message{}).
		Where(key, value).
		First(&m).Error
}

func (m *Message) Delete() error {
	return DB.Delete(&m).Error
}

func (m *Message) Save() error {
	return DB.Save(&m).Error
}

func ClearMessages() error {
	return DB.Exec("DELETE FROM messages").Error
}
