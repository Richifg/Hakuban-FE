import React from 'react';
import { TextStyle } from '../../../../../interfaces';

interface TextStyleSelector {
    onChange(value: boolean, key: string): void;
    isBold: boolean | undefined;
    boldKey: keyof TextStyle;
    isItalic: boolean | undefined;
    italicKey: keyof TextStyle;
}

const TextStyleSelector = ({ onChange, isBold, boldKey, isItalic, italicKey }: TextStyleSelector): React.ReactElement => {
    return (
        <div className="text-style-selector">
            <button onClick={() => onChange(!isBold, boldKey)}>bold</button>
            <button onClick={() => onChange(!isItalic, italicKey)}>italic</button>
        </div>
    );
};

export default TextStyleSelector;
