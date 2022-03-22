import React from 'react';
import ArrowOptions from './ArrowOptions';
import { ArrowType, LineStyle } from '../../../../../interfaces';
import './ArrowSelector.scss';

interface ArrowSelector {
    arrow0?: ArrowType;
    arrow0Key: keyof LineStyle;
    arrow2?: ArrowType;
    arrow2Key: keyof LineStyle;
    onChange: (value: string, key: keyof LineStyle) => void;
}

const ArrowSelector = ({
    arrow0 = 'none',
    arrow0Key,
    arrow2 = 'none',
    arrow2Key,
    onChange,
}: ArrowSelector): React.ReactElement => {
    const handleArrow0Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.currentTarget.value, arrow0Key);
    };
    const handleArrow2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.currentTarget.value, arrow2Key);
    };

    const handleSwap = () => {
        onChange(arrow0, arrow2Key);
        onChange(arrow2, arrow0Key);
    };

    return (
        <div className="arrow-selector">
            <select onChange={handleArrow0Change} value={arrow0}>
                <ArrowOptions flipIcon />
            </select>
            <button onClick={handleSwap}>swap</button>
            <select onChange={handleArrow2Change} value={arrow2}>
                <ArrowOptions flipIcon />
            </select>
        </div>
    );
};

export default ArrowSelector;
