// TableComponent.tsx

"use client";

import React, { useState, useRef } from 'react';
import { Trash2, PauseCircle, PlayCircle, Eye, FileText, Download, Circle } from 'lucide-react';
import {fetchMessages} from '@/services/historyService';

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

const rows: Data[] = [
    createData(
        {
            nom: 'Thom',
            prenom: 'Thom',
            dateNaissance: '25/06/2024',
            telPortable: '123456789'
        },
        {
            etape: 'J+1',
            protocole: 'Test Classique',
            suiviSMS: 'OK',
            dateReference: '24/06/2024 07:00:00',
            etat: 'Actif',
            numeroOperation: '0987656767',
            medecin: '',
            interventionExamen: '',
            dureeIntervention: ''
        },
        [<Circle key="circle" />, <Trash2 key="trash2" />, <PauseCircle key="pause" />, <PlayCircle key="play" />, <Eye key="eye" />, <FileText key="filetext" />, <Download key="download" />]
    ),

];

const TableComponent = () => {
    const accessToken = localStorage.getItem('access_token') || '';
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<{ question: string, answer: string }[]>([]);
    const [modalTitle, setModalTitle] = useState<string>('');


    const handlePhoneClick = async (row: Data) => {
        const request = fetch (`/api/messages/phone/${row.telPortable}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });    


        const response = await request;
        const messagesContent = await response.json();
        setMessages(messagesContent);

        console.log('token:', accessToken);
        //const messagesContent = await fetchMessages(row.telPortable, accessToken);

        setModalTitle(`Historique du chat pour ${row.nom} ${row.prenom} ${row.telPortable}`);
        if (chatHistoryRef.current) {
            chatHistoryRef.current.style.display = 'block';
        }

        console.log('Messages:', messagesContent);
        console.log('message.question', messagesContent[0].question);
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
                    {rows.map((row, index) => (
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
                                <div className="p-2 my-1 rounded-lg bg-gray-200 mr-auto w-3/4">
                                    {message.question}
                                </div>
                                <div className="p-2 my-1 rounded-lg bg-blue-100 ml-auto w-3/4">
                                    {message.answer}
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
