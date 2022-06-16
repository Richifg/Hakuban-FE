import React from 'react';
import { StrokeStyle } from '../../../../../interfaces';
import './WidthSelector.scss';

const key: keyof StrokeStyle = 'lineWidth';

interface WidthSelector {
    width: number;
    onChange(value: number, key: string): void;
}

const WidthSelector = ({ onChange, width }: WidthSelector): React.ReactElement => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.currentTarget.value);
        if (value > 20 || value < 1) return;
        onChange(value, key);
    };

    return (
        <div className="width-selector">
            <input className="line-width-input" type="number" onChange={handleChange} value={width} />
        </div>
    );
};

export default WidthSelector;
