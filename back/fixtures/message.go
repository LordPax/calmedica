package fixtures

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"hackathon/models"
	"io"
	"math/rand"
	"os"
	"strings"
)

var dataPath = "fixtures/data.csv"

func fixUnmatchedQuotes(line string) string {
	quoteCount := strings.Count(line, "\"")
	if quoteCount%2 != 0 {
		line += "\""
	}
	return line
}

func getRandomizedSentiment() string {
	sentiments := []string{"neutral", "positive", "negative"}
	return sentiments[rand.Intn(len(sentiments))]
}

func cleanCSVContent(lines []string) []string {
	var cleanedLines []string

	for _, line := range lines {
		cleanedLine := fixUnmatchedQuotes(line)
		cleanedLines = append(cleanedLines, cleanedLine)
	}

	return cleanedLines
}

func LoadMessages() error {
	file, err := os.Open(dataPath)
	if err != nil {
		return err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	if err := scanner.Err(); err != nil {
		return fmt.Errorf("error reading file: %w", err)
	}

	cleanedLines := cleanCSVContent(lines)
	reader := csv.NewReader(strings.NewReader(strings.Join(cleanedLines, "\n")))
	reader.Comma = ';'
	reader.FieldsPerRecord = -1

	if err := models.ClearMessages(); err != nil {
		return err
	}

	successfulMessages := 0
	i := 0
	for {
		var patient models.Patient
		record, err := reader.Read()
		if err != nil {
			if err == io.EOF {
				break
			}
			fmt.Printf("Skipping invalid record on line %d due to error: %v\n", i+1, err)
			continue
		}

		if len(record) < 3 {
			fmt.Printf("Skipping incomplete record on line %d: %v\n", i+1, record)
			continue
		}

		messageContent := record[2]

		patientId := rand.Intn(PATIENT_NB-1) + 1
		if err = patient.FindOneById(patientId); err != nil {
			return fmt.Errorf("error finding patient with id %d: %w", patientId, err)
		}

		message := models.Message{
			Content:       messageContent,
			Phone:         patient.Phone,
			Sentiment:     getRandomizedSentiment(),
			SentimentRate: fake.RandomFloat(2, 0, 100),
		}

		if err := message.Save(); err != nil {
			fmt.Printf("Error saving message on line %d: %v\n", i+1, err)
			continue
		}

		fmt.Printf("Message \"%s\" saved\n", messageContent)
		successfulMessages++
		i++

		if successfulMessages >= MESSAGE_NB {
			break
		}
	}

	return nil
}
