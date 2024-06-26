import React from 'react';
import { Data } from './Datatable';

interface InteractiveCellProps {
    row: Data;
    onPhoneClick: (data: Data) => void;
}

const InteractiveCell: React.FC<InteractiveCellProps> = ({ row, onPhoneClick }) => {
    return (
        <td
            className="py-2 px-4 border-b text-blue-500 underline cursor-pointer"
            onClick={() => onPhoneClick(row)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onPhoneClick(row);
                    }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Phone number: ${row.telPortable}`}
             >
                {row.telPortable}
             </td>
             );
             };
             
             export default InteractiveCell;