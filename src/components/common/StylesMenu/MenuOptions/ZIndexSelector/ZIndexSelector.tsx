import React from 'react';
import { BoardItem } from '../../../../../interfaces';
import { useDispatch, useSelector } from '../../../../../hooks';
import { setMaxZIndex, setMinZIndex } from '../../../../../store/slices/boardSlice';
import { pushItemChanges } from '../../../../../BoardStateMachine/BoardStateMachineUtils';
import './ZIndexSelector.scss';

const KEY: keyof BoardItem = 'zIndex';

interface ZIndexSelector {
    items: BoardItem[];
}

const ZIndexSelector = ({ items }: ZIndexSelector): React.ReactElement => {
    const dispatch = useDispatch();
    const { maxZIndex, minZIndex } = useSelector((s) => s.board);

    const handleChange = (zIndex: number, action: typeof setMaxZIndex) => () => {
        const updateData = items.map(({ id }) => ({ id, [KEY]: zIndex }));
        pushItemChanges(updateData);
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
