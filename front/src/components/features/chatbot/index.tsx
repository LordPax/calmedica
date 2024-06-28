'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Button } from '@/components/ui/button';
import Microphone from '@/components/features/microphone';
import Uploader from '@/components/ui/uploader';

const ChatBot: React.FC = () => {
    const { messages, sendMessage, loading, addContext } = useOpenAI();
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [formData, setFormData] = useState<{ input: string, files: File[] }>({ input: '', files: [] }); // State to hold input and files
    const [contextAdded, setContextAdded] = useState(false);
    const [surveyStep, setSurveyStep] = useState<number>(0);
    const [survey, setSurvey] = useState<{ question: string; options: string[] } | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (!contextAdded) {
            addContext(
                "Tu es RaoultBot, un éminent praticien inspiré par le Professeur Didier Raoult, célèbre pour ses méthodes innovantes en microbiologie et maladies infectieuses. Avec 15 ans d'expérience dans le domaine médical, tu travailles dans un environnement de haute spécialisation. Ta mission est d'appliquer ton expertise pour diagnostiquer et proposer des traitements personnalisés à tes patients, utilisant une approche unique basée sur les dernières découvertes de la recherche médicale. Ta mission principale est de vérifier si tu peux répondre à tes patients en fonction de leur besoin et de leur environnement et de s'assurer qu'ils vont bien.",
            );
            setContextAdded(true);
        }
    }, [addContext, contextAdded]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('formData', formData);
        setFormData((prevFormData) => ({ ...prevFormData, input: event.target.value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const { input, files } = formData;

        if (!input) return;

        sendMessage(input);
        setFormData({ input: '', files: [] });

        if (files.length > 0) {
            const formDataToSend = new FormData();
            formDataToSend.append('phone', '123456789');
            formDataToSend.append('content', input);
            files.forEach(file => {
                formDataToSend.append('upload[]', file);
            });

            try {
                const response = await fetch('http://localhost:8080/messages/', {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                } else {
                    console.error('Failed to upload files.');
                }
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        }
    };

    const handleAudioData = (text: string) => {
        setFormData((prevFormData) => ({ ...prevFormData, input: prevFormData.input + text }));
    }

    const handleFilesData = (files: File[]) => {
        setFormData((prevFormData) => ({ ...prevFormData, files }));
    }

    const renderMessages = useCallback(() => {
        return messages?.length > 0
            ? messages.map((message, index) =>
                  message.role !== 'system' ? (
                      <div
                          key={index}
                          className={`p-2 my-1 rounded-lg ${
                              message.role === 'user'
                                  ? 'bg-orange-200 ml-auto w-3/4'
                                  : 'bg-gray-200 mr-auto w-3/4'
                          }`}
                          style={{ whiteSpace: 'pre-wrap' }}
                      >
                          <p>{message.content as string}</p>
                      </div>
                  ) : null
              )
            : 'No messages';
    }, [messages]);

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-0 right-0 mb-4 mr-4"
            >
                Open Chat
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 min-w-[500px] h-auto max-w-2xl w-full">
                <div className="flex justify-between items-center">
                    <h2>RaoultBot</h2>
                    <button onClick={() => setIsOpen(false)}>x</button>
                </div>
                <div className="overflow-y-auto h-96 mb-4">
                    <div className="p-2 my-1 rounded-lg bg-gray-200 mr-auto w-3/4">
                        Bonjour, je suis RaoultBot, ton médecin personnel et conseiller pour ta e-santé. J'espère que vous allez bien et que vous vous sentez bien.
                    </div>
                    {renderMessages()}
                    {loading && (
                        <div className="flex justify-center items-center p-2 my-1 rounded-lg bg-gray-200 mr-auto w-3/4">
                            <div className="dot-flashing"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="flex items-center justify-between w-full space-x-2">
                    <input
                        type="text"
                        onChange={handleInputChange}
                        value={formData.input}
                        className="flex-grow border p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send
                    </button>
                    <div className="flex items-center justify-center space-x-3">
                        <Uploader onFilesdData={handleFilesData} />
                        <Microphone onAudioData={handleAudioData} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChatBot;
