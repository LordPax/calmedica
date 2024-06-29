package services

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"

	openai "github.com/sashabaranov/go-openai"
)

const IMAGE_PROMPT = "en 1 mot, détermine le sentiment general de ces images, tu a le choix entre positif, négatif ou neutre, n'explique pas pourquoi, juste donne un sentiment, si tu en a plusieurs, fait une moyenne"

type NegativityPayload struct {
	Text      string `json:"text"`
	Providers string `json:"providers"`
	Language  string `json:"language"`
}

type Item struct {
	Segment       string  `json:"segment"`
	Sentiment     string  `json:"sentiment"`
	SentimentRate float64 `json:"sentiment_rate"`
}

type SentimentEvaluation struct {
	GeneralSentiment     string  `json:"general_sentiment"`
	GeneralSentimentRate float64 `json:"general_sentiment_rate"`
	Items                []Item  `json:"items"`
	OriginalResponse     string  `json:"original_response"`
	Status               string  `json:"status"`
}

func Chat(messages []openai.ChatCompletionMessage) (openai.ChatCompletionResponse, error) {
	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))

	response, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:    openai.GPT4Turbo,
			Messages: messages,
		},
	)

	if err != nil {
		return openai.ChatCompletionResponse{}, err
	}

	return response, nil
}

func AddImageToChat(imageUrl []string, prompt string) []openai.ChatCompletionMessage {
	var messageParts []openai.ChatMessagePart

	for _, url := range imageUrl {
		messageParts = append(messageParts, openai.ChatMessagePart{
			Type: "image_url",
			ImageURL: &openai.ChatMessageImageURL{
				URL: url,
			},
		})
	}

	messageParts = append(messageParts, openai.ChatMessagePart{
		Type: "text",
		Text: prompt,
	})

	messages := []openai.ChatCompletionMessage{
		{
			Role:         "user",
			MultiContent: messageParts,
		},
	}

	return messages
}

func EvaluateNegativity(text string) (map[string]SentimentEvaluation, error) {
	var evaluation map[string]SentimentEvaluation

	payloadData := NegativityPayload{
		Text:      text,
		Providers: "amazon",
		Language:  "fr",
	}

	strPayload, _ := json.Marshal(payloadData)
	payload := strings.NewReader(string(strPayload))

	req, err := http.NewRequest("POST", os.Getenv("EDENAI_API_URL"), payload)
	if err != nil {
		return evaluation, err
	}

	req.Header.Add("Authorization", os.Getenv("EDENAI_API_KEY"))
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return evaluation, err
	}
	defer res.Body.Close()

	body, _ := io.ReadAll(res.Body)

	if err := json.Unmarshal(body, &evaluation); err != nil {
		return evaluation, err
	}

	return evaluation, nil
}
