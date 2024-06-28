"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, PauseCircle, PlayCircle, Eye, FileText, Download, Circle } from 'lucide-react';

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
    etape: string,
    protocole: string,
    telPortable: string,
    suiviSMS: string,
    dateReference: string,
    etat: string,
    numeroOperation: string,
    nom: string,
    prenom: string,
    dateNaissance: string,
    medecin: string,
    interventionExamen: string,
    dureeIntervention: string,
}

function createData(
    medicalInfo: MedicalInfo,
    icons: JSX.Element[]
): Data {
    return { ...medicalInfo, icons };
}

const TableComponent = () => {
    const accessToken = localStorage.getItem('access_token') || '';
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [users, setUsers] = useState<Data[]>([]);
    const [messages, setMessages] = useState<{ question: string, answer: string }[]>([]);
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
                            etape: user.step,
                            protocole: user.protocol,
                            telPortable: "123456789",
                            suiviSMS: user.sms,
                            dateReference: user.date,
                            etat: user.state,
                            numeroOperation: user.number,
                            nom: user.lastname,
                            prenom: user.firstname,
                            dateNaissance: user.birthdate,
                            medecin: user.medic,
                            interventionExamen: user.examen_intervention,
                            dureeIntervention: user.intervention_duration,
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
        } else {
            console.error('Access token est manquant');
        }
    }, [accessToken]);

    const handlePhoneClick = async (row: Data) => {
        const request = fetch(`/api/messages/phone/${row.telPortable}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const response = await request;
        const messagesContent = await response.json();
        setMessages(messagesContent);

        setModalTitle(`Historique du chat pour ${row.nom} ${row.prenom} ${row.telPortable}`);
        if (chatHistoryRef.current) {
            chatHistoryRef.current.style.display = 'flex';
        }
    };

    const handleCloseModal = () => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.style.display = 'none';
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            handleCloseModal();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                        {/* <th className="py-2 px-4 border-b">Intervention/Examen</th>
                        <th className="py-2 px-4 border-b">Durée Intervention</th> */}
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
            <div ref={chatHistoryRef} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 hidden">
                <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-4 min-w-[500px] max-w-2xl w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">{modalTitle}</h2>
                        <button onClick={handleCloseModal} className="text-red-500">x</button>
                    </div>
                    <div className="overflow-y-auto h-96 mb-4">
                        {messages.map((message, index) => (
                            <div key={index} className="w-full mb-4">
                                <div className="flex flex-col items-start w-3/4">
                                    <div className="text-sm text-gray-600">IA</div>
                                    <div className="p-2 rounded-lg bg-gray-200 w-full mt-1">
                                        {message.question}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end w-3/4 ml-auto">
                                    <div className="text-sm text-gray-600">Patient</div>
                                    <div className="p-2 rounded-lg bg-blue-100 w-full mt-1">
                                        {message.answer}
                                    </div>
                                </div>
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
