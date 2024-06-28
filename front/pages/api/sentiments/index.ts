import { NextApiRequest, NextApiResponse } from 'next';
import ky from 'ky';

const options = (text: string) => ({
  method: 'POST',
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjgxODFhNDctZDcyOC00ZDBiLThlMjMtMGExYWMzN2JkNDgzIiwidHlwZSI6ImFwaV90b2tlbiJ9.3ifFuTIeNXn9g3sBuJAJTxYV_oYuAorq5VxekORrs00',
    'Content-Type': 'application/json',
  },
  json: {
    providers: 'amazon',
    text: text,
    language: 'fr',
  },
});

interface RequestBody {
  userId: string;
  wellBeingLevel: number;
  description: string;
}

interface SentimentResponse {
  [provider: string]: {
    items: Array<{ sentiment: string }>;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, wellBeingLevel, description }: RequestBody = req.body;

    if (!description) {
      res.status(400).json({ error: 'Description is required' });
      return;
    }

    try {
      const response: SentimentResponse = await ky
        .post('https://api.edenai.run/v2/text/sentiment_analysis', options(description))
        .json();
      const provider = Object.keys(response)[0]; // Assume we use the first provider
      const sentimentScore = response[provider].items[0].sentiment;
      const sentimentStatus = sentimentScore === 'positive' ? 'Positive' : 'Negative';

      console.log(`Received: ${userId} - Level: ${wellBeingLevel}, Description: ${description}, Sentiment: ${sentimentStatus}`);

      res.status(200).json({ 
        message: 'Well-being data received successfully',
        sentiment: sentimentStatus,
        sentimentScore: sentimentScore
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error analyzing sentiment' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
