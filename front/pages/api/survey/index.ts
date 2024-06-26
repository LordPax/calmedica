import type { NextApiRequest, NextApiResponse } from 'next';

type SurveyState = {
    question: string;
    options: string[];
};

const surveyQuestions: SurveyState[] = [
    {
        question: 'Sur une échelle de 1 à 10, comment évalueriez-vous votre douleur actuelle?',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
    {
        question: 'La douleur est-elle constante ou intermittente?',
        options: ['Constante', 'Intermittente'],
    },
    {
        question: 'Quelle est la nature de votre douleur?',
        options: ['Aiguë', 'Sourde', 'Lancinante', 'Brûlante'],
    },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(400).json({ message: 'Invalid method' });

    const { step } = req.body;
    if (step < 0 || step >= surveyQuestions.length) {
        return res.status(400).json({ message: 'Invalid step' });
    }

    const surveyState = surveyQuestions[step];
    return res.status(200).json(surveyState);
}
