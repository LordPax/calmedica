package fixtures

import (
	"hackathon/models"

	"github.com/jaswdr/faker/v2"
)

var (
	fake = faker.New()

	USER_PASSWORD = "password"
	USER_NB       = 20
	USER_ROLES    = []string{models.ROLE_USER, models.ROLE_ADMIN, models.ROLE_DOCTOR}

	MESSAGE_NB = 100

	PATIENT_NB = 10
)

func ImportFixtures() error {
	if err := LoadUsers(); err != nil {
		return err
	}

	if err := LoadPatients(); err != nil {
		return err
	}

	if err := LoadMessages(); err != nil {
		return err
	}

	return nil
}
