import React from 'react';
import { Align, TextStyle } from '../../../../../interfaces';
import AlignmentOptions from './AlignmentOptions';
import './AlignmentSelector.scss';

interface AligmentSelector {
    align: Align;
    onChange(value: Align, key: string): void;
    styleKey: keyof TextStyle;
}

const AligmentSelector = ({ onChange, styleKey, align }: AligmentSelector): React.ReactElement => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.currentTarget.value as Align;
        onChange(value, styleKey);
    };

    return (
        <div className="alignment-selector">
            {styleKey}
            <select onChange={handleChange} value={align}>
                <AlignmentOptions />
            </select>
        </div>
    );
};

export default AligmentSelector;
