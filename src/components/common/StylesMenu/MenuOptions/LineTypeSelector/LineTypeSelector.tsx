import React from 'react';
import LineTypeOptions from './LineTypeOptions';
import { LineType, LineStyle } from '../../../../../interfaces';
import './LineTypeSelector.scss';

const key: keyof LineStyle = 'lineType';

interface LineTypeSelector {
    onChange(value: string, key: string): void;
    lineType: LineType;
}

const LineTypeSelector = ({ onChange, lineType }: LineTypeSelector): React.ReactElement => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.currentTarget;
        onChange(value, key);
    };

    return (
        <div className="arrow-selector">
            <select onChange={handleChange} value={lineType}>
                <LineTypeOptions />
            </select>
        </div>
    );
};

export default LineTypeSelector;
