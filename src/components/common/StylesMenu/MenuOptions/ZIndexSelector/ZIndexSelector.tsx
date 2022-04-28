import React from 'react';
import { useDispatch, useSelector } from '../../../../../hooks';
import { updateItems, setMaxZIndex, setMinZIndex } from '../../../../../store/slices/itemsSlice';
import { BoardItem } from '../../../../../interfaces';
import './ZIndexSelector.scss';

const KEY: keyof BoardItem = 'zIndex';

interface ZIndexSelector {
    items: BoardItem[];
}

const ZIndexSelector = ({ items }: ZIndexSelector): React.ReactElement => {
    const dispatch = useDispatch();
    const { maxZIndex, minZIndex } = useSelector((s) => s.items);

    const handleChange = (zIndex: number, action: typeof setMaxZIndex) => () => {
        const updateData = items.map(({ id }) => ({ id, [KEY]: zIndex }));
        dispatch(updateItems(updateData));
        dispatch(action(zIndex));
    };

    return (
        <div className="z-index-selector">
            <button onClick={handleChange(minZIndex - 1, setMinZIndex)}>back</button>
            <button onClick={handleChange(maxZIndex + 1, setMaxZIndex)}>front</button>
        </div>
    );
};

export default ZIndexSelector;
