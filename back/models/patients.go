package models

import (
	"hackathon/services"
	"time"
)

type Patient struct {
	ID                   int       `json:"id" gorm:"primary_key"`
	Step                 string    `json:"step"`
	Protocol             string    `json:"protocol"`
	Status               string    `json:"status"`
	Phone                string    `json:"phone"`
	SMS                  bool      `json:"sms"`
	Date                 time.Time `json:"date"`
	State                bool      `json:"state"`
	Number               string    `json:"number" gorm:"varchar(11)"`
	Firstname            string    `json:"firstname" gorm:"varchar(50)"`
	Lastname             string    `json:"lastname" gorm:"varchar(50)"`
	Birthdate            time.Time `json:"birthdate"`
	Medic                string    `json:"medic"`
	ExamenIntervention   time.Time `json:"examen"`
	InterventionDuration int       `json:"duration"`
}

func FindAllPatients(query services.QueryFilter) ([]Patient, error) {
	var patients []Patient

	err := DB.Model(&Patient{}).
		Offset(query.GetSkip()).
		Limit(query.GetLimit()).
		Where(query.GetWhere()).
		Order(query.GetSort()).
		Find(&patients).Error

	return patients, err
}

func (p *Patient) FindOneById(id int) error {
	return DB.Model(&Patient{}).
		First(&p, id).Error
}

func (p *Patient) FindOne(key string, value any) error {
	return DB.Model(&Patient{}).
		Where(key, value).
		First(&p).Error
}

func (p *Patient) Save() error {
	return DB.Save(&p).Error
}

func (p *Patient) Delete() error {
	return DB.Delete(&p).Error
}

func ClearPatients() error {
	return DB.Exec("DELETE FROM patients").Error
}
