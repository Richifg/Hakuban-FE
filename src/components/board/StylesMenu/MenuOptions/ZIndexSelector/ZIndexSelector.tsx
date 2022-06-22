import React from 'react';
import { BoardItem } from '../../../../../interfaces';
import { useSelector } from '../../../../../hooks';
import { MenuItem } from '../../../../common';

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
        <>
            <MenuItem iconName="back" type="button" onClick={handleChange(minZIndex - 1)} />
            <MenuItem iconName="front" type="button" onClick={handleChange(maxZIndex + 1)} />
        </>
    );
};

export default ZIndexSelector;
