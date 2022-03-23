import React from 'react';
import { ShapeStyle, DrawingStyle } from '../../../../../interfaces';
import './WidthSelector.scss';

interface WidthSelector {
    value: number;
    onChange(value: number, styleKey: string): void;
    styleKey: keyof ShapeStyle | keyof DrawingStyle;
}

const WidthSelector = ({ onChange, value, styleKey }: WidthSelector): React.ReactElement => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.currentTarget.value);
        if (value > 20 || value < 1) return;
        onChange(value, styleKey);
    };

    return (
        <div className="width-selector">
            <input className="line-width-input" type="number" onChange={handleChange} value={value} />
        </div>
    );
};

export default WidthSelector;
