// components/TableComponent.js
import React from 'react';
import {
    Trash2,
    PauseCircle,
    PlayCircle,
    Eye,
    FileText,
    Download,
    Video,
    Circle,
    CheckCircle,
    XCircle,
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

function createData(
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
    icons: JSX.Element[]
): Data {
    return { etape, protocole, telPortable, suiviSMS, dateReference, etat, numeroOperation, nom, prenom, dateNaissance, medecin, interventionExamen, dureeIntervention, icons };
}

const rows: Data[] = [
    createData(
        'J+1',
        'Test Classique',
        '07 89 71 49 59',
        'OK',
        '24/06/2024 07:00:00',
        'Actif',
        '0987656767',
        'Thom',
        'Thom',
        '25/06/2024',
        '',
        '',
        '',
        [<Circle />, <Trash2 />, <PauseCircle />, <PlayCircle />, <Eye />, <FileText />, <Download />]
    ),
    createData(
        '',
        'Test Classique',
        '01 85 09 01 81',
        'KO',
        '09/02/2024 07:00:00',
        'Actif',
        '325',
        'FIXE',
        'Germain',
        '02/07/1984',
        '',
        '',
        '',
        [<Circle />, <Trash2 />, <PauseCircle />, <PlayCircle />, <Eye />, <FileText />, <Download />]
    ),
    createData(
        '',
        'Test Classique',
        '06 00 00 03 17',
        'OK',
        '29/01/2024 10:30:00',
        'Actif',
        '317',
        'NAUSETTE',
        'Jeanne',
        '13/11/1983',
        '',
        '',
        '',
        [<Circle />, <Trash2 />, <PauseCircle />, <PlayCircle />, <Eye />, <FileText />, <Download />]
    ),
    createData(
        '',
        'Test Classique',
        '06 00 00 03 14',
        'OK',
        '18/01/2024 08:00:00',
        'Actif',
        '314',
        'PWA',
        'Henri',
        '10/10/2000',
        '',
        '',
        '',
        [<Circle />, <Trash2 />, <PauseCircle />, <PlayCircle />, <Eye />, <FileText />, <Download />]
    ),
    createData(
        '',
        'Test Classique',
        '06 00 00 03 01',
        'OK',
        '03/01/2024 10:00:00',
        'Actif',
        '301',
        'DOULEUR',
        'Jean',
        '10/10/2001',
        '',
        '',
        '',
        [<Circle />, <Trash2 />, <PauseCircle />, <PlayCircle />, <Eye />, <FileText />, <Download />]
    ),
    createData(
        '',
        'Test Classique',
        '06 00 00 03 04',
        'OK',
        '06/07/2023 15:00:00',
        'Actif',
        '304',
        'VIDEO',
        'Marie',
        '30/06/1984',
        '',
        '',
        '',
        [<Circle />, <Trash2 />, <PauseCircle />, <PlayCircle />, <Eye />, <FileText />, <Download />]
    ),
];

const TableComponent = () => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border bg-gray-100">Icones</th>
                        <th className="px-4 py-2 border bg-gray-100">Etape</th>
                        <th className="px-4 py-2 border bg-gray-100">Protocole</th>
                        <th className="px-4 py-2 border bg-gray-100">Tél. Portable</th>
                        <th className="px-4 py-2 border bg-gray-100">Suivi SMS</th>
                        <th className="px-4 py-2 border bg-gray-100">Date de référence</th>
                        <th className="px-4 py-2 border bg-gray-100">Etat</th>
                        <th className="px-4 py-2 border bg-gray-100">Numéro d'opération</th>
                        <th className="px-4 py-2 border bg-gray-100">Nom</th>
                        <th className="px-4 py-2 border bg-gray-100">Prénom</th>
                        <th className="px-4 py-2 border bg-gray-100">Date de naissance</th>
                        <th className="px-4 py-2 border bg-gray-100">Médecin</th>
                        <th className="px-4 py-2 border bg-gray-100">Intervention/Examen</th>
                        <th className="px-4 py-2 border bg-gray-100">Durée intervention</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-2 border">
                                <div className="flex space-x-2">
                                    {row.icons.map((icon, idx) => (
                                        <div key={idx} className="text-gray-500">{icon}</div>
                                    ))}
                                </div>
                            </td>
                            <td className="px-4 py-2 border">{row.etape}</td>
                            <td className="px-4 py-2 border">{row.protocole}</td>
                            <td className="px-4 py-2 border">{row.telPortable}</td>
                            <td className={`px-4 py-2 border ${row.suiviSMS === 'OK' ? 'text-green-600' : 'text-red-600'}`}>{row.suiviSMS}</td>
                            <td className="px-4 py-2 border text-orange-500">{row.dateReference}</td>
                            <td className="px-4 py-2 border">{row.etat}</td>
                            <td className="px-4 py-2 border">{row.numeroOperation}</td>
                            <td className="px-4 py-2 border">{row.nom}</td>
                            <td className="px-4 py-2 border">{row.prenom}</td>
                            <td className="px-4 py-2 border">{row.dateNaissance}</td>
                            <td className="px-4 py-2 border">{row.medecin}</td>
                            <td className="px-4 py-2 border">{row.interventionExamen}</td>
                            <td className="px-4 py-2 border">{row.dureeIntervention}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;
