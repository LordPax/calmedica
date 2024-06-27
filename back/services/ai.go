package services

import (
	"context"
	"os"

	openai "github.com/sashabaranov/go-openai"
)

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
