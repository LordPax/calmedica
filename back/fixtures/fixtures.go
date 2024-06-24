package fixtures

import (
	"hackathon/models"

	"github.com/jaswdr/faker/v2"
)

var (
	fake = faker.New()

	USER_PASSWORD = "password"
	USER_NB       = 20
	USER_ROLES    = []string{models.ROLE_USER, models.ROLE_ADMIN}
)

func ImportFixtures() error {
	if err := LoadUsers(); err != nil {
		return err
	}

	return nil
}
