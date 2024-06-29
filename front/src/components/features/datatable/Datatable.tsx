"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, PauseCircle, PlayCircle, Eye, FileText, Download, Circle } from 'lucide-react';
import { fetchMessages, Message } from '@/services/historyService';
import { WebsocketService } from '@/services/websocket';

interface Data {
    etape: string;
    protocole: string;
    telPortable: string;
    suiviSMS: string;
    dateReference: string;
    etat: string;
    numeroOperation: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
    medecin: string;
    interventionExamen: string;
    dureeIntervention: string;
    icons: JSX.Element[];
}

interface PersonalInfo {
    nom: string;
    prenom: string;
    dateNaissance: string;
    telPortable: string;
}

interface MedicalInfo {
    etape: string;
    protocole: string;
    suiviSMS: string;
    dateReference: string;
    etat: string;
    numeroOperation: string;
    medecin: string;
    interventionExamen: string;
    dureeIntervention: string;
}

function createData(
    personalInfo: PersonalInfo,
    medicalInfo: MedicalInfo,
    icons: JSX.Element[]
): Data {
    return { ...personalInfo, ...medicalInfo, icons };
}

const TableComponent = () => {
    const accessToken = localStorage.getItem('access_token') || '';
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    const [users, setUsers] = useState<Data[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [modalTitle, setModalTitle] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const request = await fetch(`/api/users`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!request.ok) {
                    throw new Error('La réponse du réseau n\'était pas correcte');
                }

                const userData = await request.json();

                if (userData.length === 0) {
                    console.warn('Aucun utilisateur trouvé');
                }

                const formattedData = userData.map((user: any) => 
                    createData(
                        {
                            nom: user.firstname,
                            prenom: user.lastname,
                            dateNaissance: user.dateNaissance,
                            telPortable: "123456789",
                            // telPortable: user.telPortable,
                        },
                        {
                            etape: user.etape,
                            protocole: user.protocole,
                            suiviSMS: user.suiviSMS,
                            dateReference: user.dateReference,
                            etat: user.etat,
                            numeroOperation: user.numeroOperation,
                            medecin: user.medecin,
                            interventionExamen: user.interventionExamen,
                            dureeIntervention: user.dureeIntervention,
                        },
                        [<Circle key="circle" />, <Trash2 key="trash2" />, <PauseCircle key="pause" />, <PlayCircle key="play" />, <Eye key="eye" />, <FileText key="filetext" />, <Download key="download" />]
                    )
                );
                setUsers(formattedData);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        };

        if (accessToken) {
            fetchData();
            const ws = WebsocketService.getInstance(accessToken);
            ws.on('message:create', (data) => {
                console.log('ws event create message', data);
                setMessages((prevMessages) => [...prevMessages, data]);
            });
            ws.on('message:image-ai', (data) => {
                console.log('ws event image message', data);
            });

        } else {
            console.error('Access token est manquant');
        }

        console.log('messages:', messages);
    }, [accessToken]);

    const handlePhoneClick = async (row: Data) => {
        const response = await fetchMessages(row.telPortable, accessToken);
        setMessages(response);

        setModalTitle(`Historique du chat pour ${row.nom} ${row.prenom} ${row.telPortable}`);
        if (chatHistoryRef.current) {
            chatHistoryRef.current.style.display = 'block';
        }
    };

    const handleCloseModal = () => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.style.display = 'none';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Actions</th>
                        <th className="py-2 px-4 border-b">Étape</th>
                        <th className="py-2 px-4 border-b">Protocole</th>
                        <th className="py-2 px-4 border-b">Tel Portable</th>
                        <th className="py-2 px-4 border-b">Suivi SMS</th>
                        <th className="py-2 px-4 border-b">Date Référence</th>
                        <th className="py-2 px-4 border-b">État</th>
                        <th className="py-2 px-4 border-b">Numéro Opération</th>
                        <th className="py-2 px-4 border-b">Nom</th>
                        <th className="py-2 px-4 border-b">Prénom</th>
                        <th className="py-2 px-4 border-b">Date Naissance</th>
                        <th className="py-2 px-4 border-b">Médecin</th>
                        <th className="py-2 px-4 border-b">Intervention/Examen</th>
                        <th className="py-2 px-4 border-b">Durée Intervention</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((row, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 w-80 border-b">
                                {row.icons.map((icon) => (
                                    <span key={icon.key} className="inline-block mx-1">
                                        {icon}
                                    </span>
                                ))}
                            </td>
                            <td className="py-2 px-4 border-b">{row.etape}</td>
                            <td className="py-2 px-4 border-b">{row.protocole}</td>
                            <td className="py-2 px-4 border-b">
                                <span
                                    onClick={() => handlePhoneClick(row)}
                                    className="text-blue-500 underline cursor-pointer"
                                >
                                    {row.telPortable}
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b">{row.suiviSMS}</td>
                            <td className="py-2 px-4 border-b">{row.dateReference}</td>
                            <td className="py-2 px-4 border-b">{row.etat}</td>
                            <td className="py-2 px-4 border-b">{row.numeroOperation}</td>
                            <td className="py-2 px-4 border-b">{row.nom}</td>
                            <td className="py-2 px-4 border-b">{row.prenom}</td>
                            <td className="py-2 px-4 border-b">{row.dateNaissance}</td>
                            <td className="py-2 px-4 border-b">{row.medecin}</td>
                            <td className="py-2 px-4 border-b">{row.interventionExamen}</td>
                            <td className="py-2 px-4 border-b">{row.dureeIntervention}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div ref={chatHistoryRef} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" style={{ display: 'none' }}>
                <div className="bg-white rounded-lg shadow-lg p-4 min-w-[500px] max-w-2xl w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">{modalTitle}</h2>
                        <button onClick={handleCloseModal} className="text-red-500">x</button>
                    </div>
                    <div className="overflow-y-auto h-96 mb-4">
                        {messages.map((message, index) => (
                            <div key={index} className="w-full">
                                {message.sender_id == null ? (
                                    <div className="p-2 my-1 rounded-lg bg-gray-200 mr-auto w-3/4">
                                        {message.content}
                                    </div>
                                ) : (
                                    <div className="p-2 my-1 rounded-lg bg-blue-100 ml-auto w-3/4">
                                        {message.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleCloseModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableComponent;
