import React from 'react';
import { Align, TextStyle } from '../../../../../interfaces';
import alignmentOptions from './alignmentOptions';
import './AlignmentSelector.scss';

interface AligmentSelector {
    onChange(value: Align, key: string): void;
    styleKey: keyof TextStyle;
}

const AligmentSelector = ({ onChange, styleKey }: AligmentSelector): React.ReactElement => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const value = e.currentTarget.value as Align;
        onChange(value, styleKey);
    };

    return (
        <div className="alignment-selector">
            {styleKey}
            <div className="options-container">
                {alignmentOptions.map((option) => (
                    <button className="alignment-button" value={option.value} key={option.value} onClick={handleClick}>
                        {option.value}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AligmentSelector;
