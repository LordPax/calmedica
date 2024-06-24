import React, { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface GenericModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
}

const GenericModal: React.FC<GenericModalProps> = ({ isOpen, onOpenChange, title, children }) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <Dialog.Content className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                    <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
                    <div className="mt-4">
                        {children}
                    </div>
                    <div className="flex gap-3 justify-end mt-4">
                        <Dialog.Close className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700 transition">
                            Fermer
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Overlay>
        </Dialog.Root>
    );
};

export default GenericModal;
