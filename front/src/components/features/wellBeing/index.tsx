import React from 'react';

interface WellBeingBarometerProps {
    onSelect: (option: number) => void;
}

const WellBeingBarometer: React.FC<WellBeingBarometerProps> = ({ onSelect }) => {
    const options = [1, 2, 3, 4, 5];

    return (
        <div className="flex justify-around my-4">
            {options.map(option => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none"
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default WellBeingBarometer;