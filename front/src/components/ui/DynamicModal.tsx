import React, { useState, ReactNode } from 'react';
import ModalButton from '@/components/ui/ModalButton';
import GenericModal from '@/components/ui/GenericModal';

interface ModalConfig {
    name: string;
    buttonText: string;
    modalTitle: string;
    modalContent: ReactNode;
    backgroundColor?: string;
}

interface DynamicModalManagerProps {
    modalConfigs: ModalConfig[];
}

const DynamicModalManager: React.FC<DynamicModalManagerProps> = ({ modalConfigs }) => {
    const [openModal, setOpenModal] = useState<string | null>(null);

    const handleOpenModal = (modalName: string) => {
        setOpenModal(modalName);
    };

    const handleCloseModal = () => {
        setOpenModal(null);
    };

    return (
        <div className="flex flex-wrap gap-x-12 justify-around">
            {modalConfigs.map((config, index) => (
                <React.Fragment key={index}>
                    <ModalButton
                        onClick={() => handleOpenModal(config.name)}
                        text={config.buttonText}
                        backgroundColor={config.backgroundColor}
                    />

                    {openModal === config.name && (
                        <GenericModal
                            isOpen={openModal === config.name}
                            onOpenChange={handleCloseModal}
                            title={config.modalTitle}
                        >
                            {config.modalContent}
                        </GenericModal>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default DynamicModalManager;
