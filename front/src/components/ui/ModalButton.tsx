import React from 'react';
interface ModalButtonProps {
    onClick: () => void;
    text: string;
    className?: string;
    backgroundColor?: string;
}

const ModalButton: React.FC<ModalButtonProps> = ({ onClick, text, backgroundColor, className}) => {
    return (
        <div className="mt-4">
            <button
                onClick={onClick}
                className={`text-white rounded-lg px-4 py-2 transition ${className} ${backgroundColor}`}
            >
                {text}
            </button>
        </div>
    );
};

export default ModalButton;
