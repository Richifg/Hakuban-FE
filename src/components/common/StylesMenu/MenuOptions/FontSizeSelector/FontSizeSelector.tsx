import React, { ChangeEvent } from 'react';
import { TextStyle } from '../../../../../interfaces';
import './FontSizeSelector.scss';

const key: keyof TextStyle = 'fontSize';

interface FontSizeSelector {
    fontSize: number;
    onChange(value: number, key: string): void;
}

const FontSizeSelector = ({ fontSize, onChange }: FontSizeSelector): React.ReactElement => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.currentTarget.value);
        if (value < 1) return;
        onChange(value, key);
    };

    return (
        <div className="font-size-selector">
            <input className="font-size-input" type="number" value={fontSize} onChange={handleChange} />
        </div>
    );
};

export default FontSizeSelector;
