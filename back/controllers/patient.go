package controllers

import (
	"hackathon/models"
	"hackathon/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetPatients godoc
//
//	@Summary		get all patients
//	@Description	get all patients
//	@Tags			patient
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	[]models.Patient
//	@Failure		500	{object}	utils.HttpError
//	@Router			/patients/ [get]
func GetPatients(c *gin.Context) {
	query, _ := c.MustGet("query").(services.QueryFilter)

	patients, err := models.FindAllPatients(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, patients)
}

// GetPatient godoc
//
//	@Summary		get patients by id
//	@Description	get patients by id
//	@Tags			patient
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int	true	"Patient ID"
//	@Success		200	{object}	models.Patient
//	@Failure		404	{object}	utils.HttpError
//	@Failure		500	{object}	utils.HttpError
//	@Router			/patients/{id} [get]
func GetPatient(c *gin.Context) {
	patient, _ := c.MustGet("patient").(*models.Patient)
	c.JSON(http.StatusOK, patient)
}

// GetPatientByPhone godoc
//
//	@Summary		get patients by phone
//	@Description	get patients by phone
//	@Tags			patient
//	@Accept			json
//	@Produce		json
//	@Param			phone	path		string	true	"Patient Phone"
//	@Success		200	{object}	models.Patient
//	@Failure		404	{object}	utils.HttpError
//	@Failure		500	{object}	utils.HttpError
//	@Router			/patients/phone/{phone} [get]
func GetPatientByPhone(c *gin.Context) {
	var patient models.Patient

	phone := c.Param("phone")
	if phone == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "phone not found"})
		return
	}

	if err := patient.FindOne("phone", phone); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, patient)
}
