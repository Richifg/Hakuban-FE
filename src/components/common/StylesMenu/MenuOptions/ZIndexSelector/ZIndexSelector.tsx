// ZIndexSelector

import React from 'react';
import { useDispatch, useSelector } from '../../../../../hooks';
import { updateItem, setMaxZIndex, setMinZIndex } from '../../../../../store/slices/itemsSlice';
import { BoardItem } from '../../../../../interfaces';
import './ZIndexSelector.scss';

const key: keyof BoardItem = 'zIndex';

const ZIndexSelector = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { maxZIndex, minZIndex, selectedItem } = useSelector((s) => s.items);

    const handleBack = () => {
        const value = minZIndex - 1;
        dispatch(updateItem({ id: selectedItem?.id, key, value }));
        dispatch(setMinZIndex(value));
    };
    const handleFront = () => {
        const value = maxZIndex + 1;
        dispatch(updateItem({ id: selectedItem?.id, key, value }));
        dispatch(setMaxZIndex(value));
    };

    return (
        <div className="z-index-selector">
            <button onClick={handleBack}>back</button>
            <button onClick={handleFront}>front</button>
        </div>
    );
};

export default ZIndexSelector;
