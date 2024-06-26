"use client";

import React, { useState, useRef } from 'react';
import {
    Trash2,
    PauseCircle,
    PlayCircle,
    Eye,
    FileText,
    Download,
    Circle,
} from 'lucide-react';

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
            telPortable: '07 89 71 49 59'
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
    createData(
        {
            nom: 'FIXE',
            prenom: 'Germain',
            dateNaissance: '02/07/1984',
            telPortable: '01 85 09 01 81'
        },
        {
            etape: '',
            protocole: 'Test Classique',
            suiviSMS: 'KO',
            dateReference: '09/02/2024 07:00:00',
            etat: 'Actif',
            numeroOperation: '325',
            medecin: '',
            interventionExamen: '',
            dureeIntervention: ''
        },
        [<Circle key="circle" />, <Trash2 key="trash2" />, <PauseCircle key="pause" />, <PlayCircle key="play" />, <Eye key="eye" />, <FileText key="filetext" />, <Download key="download" />]
    ),
    createData(
        {
            nom: 'NAUSETTE',
            prenom: 'Jeanne',
            dateNaissance: '13/11/1983',
            telPortable: '06 00 00 03 17'
        },
        {
            etape: '',
            protocole: 'Test Classique',
            suiviSMS: 'OK',
            dateReference: '29/01/2024 10:30:00',
            etat: 'Actif',
            numeroOperation: '317',
            medecin: '',
            interventionExamen: '',
            dureeIntervention: ''
        },
        [<Circle key="circle" />, <Trash2 key="trash2" />, <PauseCircle key="pause" />, <PlayCircle key="play" />, <Eye key="eye" />, <FileText key="filetext" />, <Download key="download" />]
    ),
    createData(
        {
            nom: 'PWA',
            prenom: 'Henri',
            dateNaissance: '10/10/2000',
            telPortable: '06 00 00 03 14'
        },
        {
            etape: '',
            protocole: 'Test Classique',
            suiviSMS: 'OK',
            dateReference: '18/01/2024 08:00:00',
            etat: 'Actif',
            numeroOperation: '314',
            medecin: '',
            interventionExamen: '',
            dureeIntervention: ''
        },
        [<Circle key="circle" />, <Trash2 key="trash2" />, <PauseCircle key="pause" />, <PlayCircle key="play" />, <Eye key="eye" />, <FileText key="filetext" />, <Download key="download" />]
    ),
    createData(
        {
            nom: 'DOULEUR',
            prenom: 'Jean',
            dateNaissance: '10/10/2001',
            telPortable: '06 00 00 03 01'
        },
        {
            etape: '',
            protocole: 'Test Classique',
            suiviSMS: 'OK',
            dateReference: '03/01/2024 10:00:00',
            etat: 'Actif',
            numeroOperation: '301',
            medecin: '',
            interventionExamen: '',
            dureeIntervention: ''
        },
        [<Circle key="circle" />, <Trash2 key="trash2" />, <PauseCircle key="pause" />, <PlayCircle key="play" />, <Eye key="eye" />, <FileText key="filetext" />, <Download key="download" />]
    ),
    createData(
        {
            nom: 'VIDEO',
            prenom: 'Marie',
            dateNaissance: '30/06/1984',
            telPortable: '06 00 00 03 04'
        },
        {
            etape: '',
            protocole: 'Test Classique',
            suiviSMS: 'OK',
            dateReference: '06/07/2023 15:00:00',
            etat: 'Actif',
            numeroOperation: '304',
            medecin: '',
            interventionExamen: '',
            dureeIntervention: ''
        },
        [<Circle key="circle" />, <Trash2 key="trash2" />, <PauseCircle key="pause" />, <PlayCircle key="play" />, <Eye key="eye" />, <FileText key="filetext" />, <Download key="download" />]
    ),
];

const TableComponent = () => {
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [modalTitle, setModalTitle] = useState<string>('');

    const handlePhoneClick = async (row: Data) => {
        try {
            const response = await fetch(`/api/messages/phone/${row.telPortable.replace(/\s+/g, '')}`);
            const data = await response.json();
            setMessages(data.messages || []);
            setModalTitle(`Historique du chat pour ${row.nom} ${row.prenom} ${row.telPortable}`);
            if (chatHistoryRef.current) {
                chatHistoryRef.current.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
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
            <div ref={chatHistoryRef} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ display: 'none' }}>
                <div className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto">
                    <h2 className="text-lg font-bold mb-4">{modalTitle}</h2>
                    <p>Messages récents :</p>
                    <ul className="list-disc pl-5">
                        {messages.map((message, index) => (
                            <li key={index}>{message}</li>
                        ))}
                    </ul>
                    <button onClick={handleCloseModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default TableComponent;
