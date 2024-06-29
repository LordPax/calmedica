"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, PauseCircle, PlayCircle, Eye, FileText, Download } from 'lucide-react';
import { fetchMessages, Message } from '@/services/historyService';
import { WebsocketService } from '@/services/websocket';
import StatusBar from '@/components/ui/statusBar';

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
    sentiment: string;
    icons: JSX.Element[];
}

interface MedicalInfo {
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
    sentiment: string;
}

function createData(
    medicalInfo: MedicalInfo,
    icons: JSX.Element[]
): Data {
    return { ...medicalInfo, icons };
}

const ColoredCircle = ({ color, tooltip }: { color: string, tooltip: string }) => {
    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <div 
                style={{
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: color
                }}
            ></div>
            <span style={{
                visibility: 'hidden',
                width: '140px',
                backgroundColor: 'black',
                color: '#fff',
                textAlign: 'center',
                borderRadius: '6px',
                padding: '5px 0',
                position: 'absolute',
                zIndex: 1,
                bottom: '125%', // Position the tooltip above the circle
                left: '50%',
                marginLeft: '-70px', // Center the tooltip
                opacity: 0,
                transition: 'opacity 0.3s',
                fontSize: '12px',
            }} className="tooltip-text">
                {tooltip}
            </span>
            <style jsx>{`
                div:hover .tooltip-text {
                    visibility: visible;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

const TableComponent = () => {
    const accessToken = localStorage.getItem('access_token') || '';
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [clickedPhone, setClickedPhone] = useState<string>('');
    const [users, setUsers] = useState<Data[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesByPhone, setMessagesByPhone] = useState<Record<string, Message[]>>({});
    const [modalTitle, setModalTitle] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const request = await fetch(`/api/users`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                const requestStatus = await fetch(`/api/status`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!request.ok || !requestStatus.ok) {
                    throw new Error('La réponse du réseau n\'était pas correcte');
                }

                const userData = await request.json();
                const statusData = await requestStatus.json();

                if (userData.length === 0) {
                    console.warn('Aucun utilisateur trouvé');
                }

                if (statusData.length === 0) {
                    console.warn('Aucun status associé');
                }

                const combinedData = userData.map((user: any) => {
                    const userStatuses = statusData.filter((status: any) => status.phone === user.phone);

                    if (userStatuses.length === 0) {
                        console.warn(`Aucun statut trouvé pour l'utilisateur avec le téléphone: ${user.phone}`);
                        return null;
                    }
                    const latestStatus = userStatuses[userStatuses.length - 1];

                    const lastSentiment = latestStatus.sentiment || '';

                    console.log(lastSentiment)

                    const tooltipText = lastSentiment === 'Positive' ? 'Sentiment positif' : lastSentiment === 'Neutral' ? 'Sentiment neutre' : 'Sentiment négatif';

                    return createData(
                        {
                            etape: latestStatus.step || '',
                            protocole: latestStatus.protocol || '',
                            telPortable: user.phone,
                            suiviSMS: latestStatus.sms || '',
                            dateReference: latestStatus.date || '',
                            etat: latestStatus.state || '',
                            numeroOperation: latestStatus.number || '',
                            nom: user.lastname,
                            prenom: user.firstname,
                            dateNaissance: user.birthdate,
                            medecin: latestStatus.medic || '',
                            interventionExamen: latestStatus.examen_intervention || '',
                            dureeIntervention: latestStatus.intervention_duration || '',
                            sentiment: lastSentiment,
                        },
                        [
                            <ColoredCircle key="circle" color={getIconColor(lastSentiment)} tooltip={tooltipText} />,
                            <Trash2 key="trash2" />,
                            <PauseCircle key="pause" />,
                            <PlayCircle key="play" />,
                            <Eye key="eye" />,
                            <FileText key="filetext" />,
                            <Download key="download" />
                        ]
                    );
                }).filter((data: Data | null) => data !== null);

                for (const data of combinedData) {
                    const response = await fetchMessages(data.telPortable, accessToken);
                    setMessagesByPhone((prevMessagesByPhone) => {
                        return {
                            ...prevMessagesByPhone,
                            [data.telPortable]: response,
                        };
                    });
                }

                setUsers(combinedData);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        };

        if (accessToken) {
            fetchData();
            const ws = WebsocketService.getInstance(accessToken);
            ws.on('message:create', (data) => {
                console.log('ws event create message', data);
                setMessagesByPhone((prevMessagesByPhone) => {
                    const phone = data.phone;
                    const messages = prevMessagesByPhone[phone] || [];
                    return {
                        ...prevMessagesByPhone,
                        [phone]: [...messages, data],
                    };
                });
            });
        } else {
            console.error('Access token est manquant');
        }
    }, [accessToken]);

    const getIconColor = (etat: string) => {
        switch (etat) {
            case 'Neutral':
                return 'orange';
            case 'Positive':
                return 'green';
            case 'Negative':
                return 'red';
            default:
                return 'gray';
        }
    };

    const handlePhoneClick = async (row: Data) => {
        setClickedPhone(row.telPortable);

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
                        {messagesByPhone[clickedPhone]?.map((message, index) => (
                            <div key={message.id} className="w-full mb-4">
                                {message.sender_id == null ? (
                                    <div className="flex flex-col items-end w-10/12 ml-auto">
                                        <div className="text-sm text-gray-600">Patient</div>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-blue-100 w-full mt-1">
                                            <span className="flex-grow">{message.content}</span>
                                            <StatusBar className="w-40 ml-4" percentage={message.sentiment_rate ?? 0} status={message.sentiment as 'Neutral' | 'Positive' | 'Negative'} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start w-10/12">
                                        <div className="text-sm text-gray-600">IA</div>
                                        <div className="p-2 rounded-lg bg-gray-200 w-full mt-1">
                                            {message.content}
                                        </div>
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
