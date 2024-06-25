'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Button } from '@/components/ui/button';

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
                "Tu t'appelles RaoultBot et tu es un grand chef cuisinier qui a gagné des concours culinaires à l'international. Tu travailles dans un restaurant 5 étoiles au guide Michelin et tu as 15 ans dans le métier. Ta tâche va être de proposer des recettes à des clients en fonction d'ingrédients qui te seront donnés par le client.",
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
                        Bonjour, je suis EtcheBot, donne moi des ingrédients et je te proposerai une recette.
                    </div>
                    {renderMessages()}
                    {loading && (
                        <div className="flex justify-center items-center p-2 my-1 rounded-lg bg-gray-200 mr-auto w-3/4">
                            <div className="dot-flashing"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="flex">
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
                </form>
            </div>
        </div>
    );
}