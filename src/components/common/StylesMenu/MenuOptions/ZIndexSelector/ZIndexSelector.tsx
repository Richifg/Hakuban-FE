import React from 'react';
import { BoardItem } from '../../../../../interfaces';
import { useSelector } from '../../../../../hooks';

const KEY: keyof BoardItem = 'zIndex';

interface ZIndexSelector {
    onChange(value: number, key: string): void;
}

const ZIndexSelector = ({ onChange }: ZIndexSelector): React.ReactElement => {
    const { maxZIndex, minZIndex } = useSelector((s) => s.board);

    const handleChange = (zIndex: number) => () => {
        onChange(zIndex, KEY);
    };

    return (
        <div className="z-index-selector">
            <button onClick={handleChange(minZIndex - 1)}>back</button>
            <button onClick={handleChange(maxZIndex + 1)}>front</button>
        </div>
    );
};

export default ZIndexSelector;
