'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Button } from '@/components/ui/button';
import Microphone from '@/components/features/microphone';
import Uploader  from '@/components/ui/uploader';

export default function ChatBot() {
    const { messages, sendMessage, loading, addContext } = useOpenAI();
    const [isOpen, setIsOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [formData, setFormData] = useState<{ input: string }>({ input: '' });
    const [contextAdded, setContextAdded] = useState(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (!contextAdded) {
            addContext(
                "Tu es RaoultBot, un éminent praticien inspiré par le Professeur Didier Raoult, célèbre pour ses méthodes innovantes en microbiologie et maladies infectieuses. Avec 15 ans d'expérience dans le domaine médical, tu travailles dans un environnement de haute spécialisation. Ta mission est d'appliquer ton expertise pour diagnostiquer et proposer des traitements personnalisés à tes patients, utilisant une approche unique basée sur les dernières découvertes de la recherche médicale.",
            );
            setContextAdded(true);
        }
    }, [addContext, contextAdded]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ input: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const { input } = formData;

        if (!input) return;

        sendMessage(input);
        setFormData({ input: '' });
    };

    const handleAudioData = (text: string) => {
        setFormData((prevFormData) => ({ input: prevFormData.input + text }));
    };

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
        <div className="fixed bottom-0 right-0 mb-4 mr-4 max-w-md w-full z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 min-w-[300px] h-auto">
                <div className="flex justify-between items-center">
                    <h2>RaoultBot</h2>
                    <button onClick={() => setIsOpen(false)}>x</button>
                </div>
                <div className="overflow-y-auto h-64 mb-4">
                    <div className="p-2 my-1 rounded-lg bg-gray-200 mr-auto w-3/4">
                        Bonjour, je suis RaoultBot, ton médecin personnel et conseiller pour ta e-santé.
                    </div>
                    {renderMessages()}
                    {loading && (
                        <div className="flex justify-center items-center p-2 my-1 rounded-lg bg-gray-200 mr-auto w-3/4">
                            <div className="dot-flashing"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {/* <Microphone onAudioData={handleAudioData} /> */}
                <form onSubmit={handleSubmit} className="flex items-center flex-wrap justify-end">
                    <div className='flex'>
                        <input
                        type="text"
                        onChange={handleInputChange}
                        value={formData.input}
                        className="flex-1 border p-2 rounded-l-lg"
                        />
                        <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-r-lg"
                        >
                        Send
                        </button>
                    </div>
                    <Uploader />
                </form>
            </div>
        </div>
    );
}