import React from 'react';
import { TextStyle } from '../../../../../interfaces';

const boldKey: keyof TextStyle = 'bold';
const italicKey: keyof TextStyle = 'italic';

interface TextStyleSelector {
    onChange(value: boolean, key: string): void;
    bold: boolean | undefined;
    italic: boolean | undefined;
}

const TextStyleSelector = ({ onChange, bold, italic }: TextStyleSelector): React.ReactElement => {
    return (
        <div className="text-style-selector">
            <button onClick={() => onChange(!bold, boldKey)}>bold</button>
            <button onClick={() => onChange(!italic, italicKey)}>italic</button>
        </div>
    );
};

export default TextStyleSelector;
