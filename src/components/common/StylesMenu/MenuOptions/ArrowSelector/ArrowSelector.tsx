import React from 'react';
import ArrowOptions from './ArrowOptions';
import { ArrowType, LineStyle } from '../../../../../interfaces';
import './ArrowSelector.scss';

const key0: keyof LineStyle = 'arrow0Type';
const key2: keyof LineStyle = 'arrow2Type';

interface ArrowSelector {
    onChange(value: string, key: string): void;
    arrow0Type: ArrowType;
    arrow2Type: ArrowType;
}

const ArrowSelector = ({ onChange, arrow0Type, arrow2Type }: ArrowSelector): React.ReactElement => {
    const handleArrowChange = (index: 0 | 2) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const key: keyof LineStyle = `arrow${index}Type`;
        const { value } = e.currentTarget;
        onChange(value, key);
    };

    const handleSwap = () => {
        onChange(key0, arrow2Type);
        onChange(key2, arrow0Type);
    };

    return (
        <div className="arrow-selector">
            <select onChange={handleArrowChange(0)} value={arrow0Type}>
                <ArrowOptions flipIcon />
            </select>
            <button onClick={handleSwap}>swap</button>
            <select onChange={handleArrowChange(2)} value={arrow2Type}>
                <ArrowOptions flipIcon />
            </select>
        </div>
    );
};

export default ArrowSelector;
