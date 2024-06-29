package fixtures

import (
	"fmt"
	"hackathon/models"
	"math/rand"
	"time"
)

func GenerateFrenchPhoneNumber() string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	var prefix int
	if r.Intn(10) < 5 {
		prefix = r.Intn(5) + 1
	} else {
		prefix = r.Intn(2) + 6
	}

	suffix := r.Intn(90000000) + 10000000

	return fmt.Sprintf("0%d%d", prefix, suffix)
}

func LoadPatients() error {
	if err := models.ClearPatients(); err != nil {
		return err
	}

	for i := 0; i < PATIENT_NB; i++ {
		patient := models.Patient{
			Firstname:            fake.Person().FirstName(),
			Lastname:             fake.Person().LastName(),
			Phone:                GenerateFrenchPhoneNumber(),
			SMS:                  fake.Bool(),
			Date:                 time.Now(),
			State:                fake.Bool(),
			Number:               "12345678901",
			Birthdate:            time.Now().Add(-time.Hour * 24 * 365 * 30),
			Medic:                fake.Person().FirstName(),
			Protocol:             "Test Classique",
			ExamenIntervention:   time.Now().Add(time.Hour * 24 * 365 * 30),
			InterventionDuration: fake.Int(),
		}

		if err := patient.Save(); err != nil {
			return err
		}

		fmt.Printf("Patient %s %s created\n", patient.Firstname, patient.Lastname)
	}

	return nil
}
