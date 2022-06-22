import React from 'react';
import { TextStyle } from '../../../../../interfaces';
import { MenuItem } from '../../../../common';

const boldKey: keyof TextStyle = 'bold';
const italicKey: keyof TextStyle = 'italic';

interface TextStyleSelector {
    onChange(value: boolean, key: string): void;
    bold: boolean | undefined;
    italic: boolean | undefined;
}

const TextStyleSelector = ({ onChange, bold, italic }: TextStyleSelector): React.ReactElement => {
    return (
        <>
            <MenuItem iconName="bold" onClick={() => onChange(!bold, boldKey)} selected={bold} />
            <MenuItem iconName="italic" onClick={() => onChange(!italic, italicKey)} selected={italic} />
        </>
    );
};

export default TextStyleSelector;
