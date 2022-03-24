import React from 'react';
import { useSelector, useDispatch } from '../../../../../hooks';
import { StrokeStyle } from '../../../../../interfaces';
import { updateItem } from '../../../../../store/slices/itemsSlice';
import './WidthSelector.scss';

const key: keyof StrokeStyle = 'lineWidth';

interface WidthSelector {
    value: number;
}

const WidthSelector = ({ value }: WidthSelector): React.ReactElement => {
    const dispatch = useDispatch();
    const { selectedItem } = useSelector((s) => s.items);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.currentTarget.value);
        if (value > 20 || value < 1) return;
        dispatch(updateItem({ id: selectedItem?.id, key, value }));
    };

    return (
        <div className="width-selector">
            <input className="line-width-input" type="number" onChange={handleChange} value={value} />
        </div>
    );
};

export default WidthSelector;
