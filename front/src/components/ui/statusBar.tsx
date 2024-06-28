import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

interface StatusBarProps {
    status: 'Positive' | 'Neutral' | 'Negative';
    percentage: number;
}

const statusConfig = {
    Positive: {
        colorClass: 'bg-green-100 text-green-600 border-green-500',
        icon: <Smile />
    },
    Neutral: {
        colorClass: 'bg-orange-100 text-orange-600 border-orange-500',
        icon: <Meh />
    },
    Negative: {
        colorClass: 'bg-red-100 text-red-600 border-red-500',
        icon: <Frown />
    }
};

const StatusBar: React.FC<StatusBarProps> = ({ status, percentage }) => {
    const { colorClass, icon } = statusConfig[status];
    return (
        <div className={`flex items-center p-4 rounded-lg border-l-4 ${colorClass}`}>
            <div className="flex items-center">
                {icon}
                <span className="ml-2 font-semibold">{status}</span>
            </div>
            <div className="ml-auto font-semibold">
                {percentage.toFixed(2)}%
            </div>
        </div>
    );
};

export default StatusBar;
