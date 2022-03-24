import React, { ChangeEvent } from 'react';
import { TextStyle } from '../../../../../interfaces';
import './FontSizeSelector.scss';

interface FontSizeSelector {
    styleKey: keyof TextStyle;
    value: number;
    onChange(value: number, key: string): void;
}

const FontSizeSelector = ({ styleKey, value, onChange }: FontSizeSelector): React.ReactElement => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.currentTarget.value);
        if (value < 1) return;
        onChange(value, styleKey);
    };

    return (
        <div className="font-size-selector">
            <input className="font-size-input" type="number" value={value} onChange={handleChange} />
        </div>
    );
};

export default FontSizeSelector;
