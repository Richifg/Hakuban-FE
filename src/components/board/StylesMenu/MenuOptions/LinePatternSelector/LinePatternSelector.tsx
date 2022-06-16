import React from 'react';
import LinePatternOptions from './LinePatternOptions';
import { LinePattern, LineStyle } from '../../../../../interfaces';
import './LinePatternSelector.scss';

const key: keyof LineStyle = 'linePattern';

interface LinePattermSelector {
    onChange(value: string, key: string): void;
    pattern: LinePattern;
}

const LinePattermSelector = ({ onChange, pattern }: LinePattermSelector): React.ReactElement => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.currentTarget;
        onChange(value, key);
    };

    return (
        <div className="line-pattern-selector">
            <select onChange={handleChange} value={pattern}>
                <LinePatternOptions />
            </select>
        </div>
    );
};

export default LinePattermSelector;
