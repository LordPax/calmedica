import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

interface SwitchButtonProps {
    id: string;
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
    id,
    label,
    checked,
    onCheckedChange,
}) => {
    return (
        <div className="flex items-center justify-between">
            <label htmlFor={id} className="mr-2">
                {label}
            </label>
            <SwitchPrimitive.Root
                id={id}
                className="switch-root"
                checked={checked}
                onCheckedChange={onCheckedChange}
            >
                <SwitchPrimitive.Thumb className="switch-thumb" />
            </SwitchPrimitive.Root>
        </div>
    );
};

export default SwitchButton;
