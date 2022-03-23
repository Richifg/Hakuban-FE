import React from 'react';
import LineTypeOptions from './LineTypeOptions';
import { LineType, LineStyle } from '../../../../../interfaces';
import './LineTypeSelector.scss';

interface ArrowSelector {
    styleKey: keyof LineStyle;
    value: LineType;
    onChange: (value: string, key: keyof LineStyle) => void;
}

const ArrowSelector = ({ styleKey, value, onChange }: ArrowSelector): React.ReactElement => {
    const handleChnage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.currentTarget.value, styleKey);
    };

    return (
        <div className="arrow-selector">
            <select onChange={handleChnage} value={value}>
                <LineTypeOptions />
            </select>
        </div>
    );
};

export default ArrowSelector;
