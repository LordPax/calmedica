package models

import "hackathon/services"

type Message struct {
	ID        int    `json:"id" gorm:"primaryKey"`
	Content   string `json:"content" gorm:"type:text"`
	AuthorID  int    `json:"author_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

func FindAllMessage(query services.QueryFilter) ([]Message, error) {
	var messages []Message

	err := DB.Model(&Message{}).
		Offset(query.GetSkip()).
		Limit(query.GetLimit()).
		Where(query.GetWhere()).
		Order(query.GetSort()).
		Find(&messages).Error

	return messages, err
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
	return DB.Exec("DELETE FROM users").Error
}
