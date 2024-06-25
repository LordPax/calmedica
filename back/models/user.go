package models

import (
	"hackathon/services"
	"time"

	"golang.org/x/crypto/bcrypt"
)

const (
	ROLE_ADMIN  = "admin"
	ROLE_DOCTOR = "doctor"
	ROLE_USER   = "user"
)

// User implements Model
type User struct {
	ID              int       `json:"id" gorm:"primaryKey"`
	Firstname       string    `json:"firstname" gorm:"type:varchar(100)"`
	Lastname        string    `json:"lastname" gorm:"type:varchar(100)"`
	Username        string    `json:"username" gorm:"type:varchar(100)"`
	Email           string    `json:"email" gorm:"type:varchar(100)"`
	Password        string    `json:"password"`
	ProfileImageUrl string    `json:"profile_image_url" gorm:"type:varchar(255)"`
	Roles           []string  `json:"roles" gorm:"json"`
	Verified        bool      `json:"verified" gorm:"default:false"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type CreateUserDto struct {
	Firstname string `json:"firstname" validate:"required"`
	Lastname  string `json:"lastname" validate:"required"`
	Username  string `json:"username" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required"`
}

type UpdateUserDto struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type SanitizedUser struct {
	ID              int       `json:"id"`
	Username        string    `json:"username"`
	Firstname       string    `json:"firstname"`
	Lastname        string    `json:"lastname"`
	ProfileImageUrl string    `json:"profile_image_url"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type LoginUserDto struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UserInfo struct {
	Email           string `json:"email"`
	Username        string `json:"username"`
	Firstname       string `json:"firstname"`
	Lastname        string `json:"lastname"`
	ProfileImageUrl string `json:"profile_image_url"`
}

func FindAllUsers(query services.QueryFilter) ([]User, error) {
	var users []User

	err := DB.Model(&User{}).
		Offset(query.GetSkip()).
		Limit(query.GetLimit()).
		Where(query.GetWhere()).
		Order(query.GetSort()).
		Find(&users).Error

	return users, err
}

func CountUsersByEmail(email string) (int64, error) {
	var count int64

	err := DB.Model(&User{}).
		Where("email = ?", email).
		Count(&count).Error

	return count, err
}

func CountUsersByUsername(username string) (int64, error) {
	var count int64

	err := DB.Model(&User{}).
		Where("username = ?", username).
		Count(&count).Error

	return count, err
}

func (u *User) Sanitize() SanitizedUser {
	user := SanitizedUser{
		ID:              u.ID,
		Username:        u.Username,
		Firstname:       u.Firstname,
		Lastname:        u.Lastname,
		ProfileImageUrl: u.ProfileImageUrl,
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
	}

	return user
}

func (u *User) IsRole(role string) bool {
	for _, r := range u.Roles {
		if r == role {
			return true
		}
	}
	return false
}

func (u *User) HashPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return err
	}

	u.Password = string(bytes)

	return nil
}

func (u *User) ComparePassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

func (u *User) FindOneById(id int) error {
	return DB.Model(&User{}).
		First(&u, id).Error
}

func (u *User) FindOne(key string, value any) error {
	return DB.Model(&User{}).
		Where(key, value).
		First(&u).Error
}

func (u *User) Delete() error {
	if err := DeleteTokensByUserID(u.ID); err != nil {
		return err
	}

	return DB.Delete(&u).Error
}

func (u *User) Save() error {
	return DB.Save(&u).Error
}

func ClearUsers() error {
	return DB.Exec("DELETE FROM users").Error
}

func UserExists(id int) bool {
	var count int64
	DB.Model(&User{}).Where("id = ?", id).Count(&count)
	return count > 0
}
