import React from 'react';
import LineTypeOptions from './LineTypeOptions';
import { useSelector, useDispatch } from '../../../../../hooks';
import { updateItem } from '../../../../../store/slices/itemsSlice';
import { LineType, LineStyle } from '../../../../../interfaces';
import './LineTypeSelector.scss';

const key: keyof LineStyle = 'lineType';

interface LineTypeSelector {
    value: LineType;
}

const LineTypeSelector = ({ value }: LineTypeSelector): React.ReactElement => {
    const dispatch = useDispatch();
    const { selectedItem } = useSelector((s) => s.items);

    const handleChnage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.currentTarget;
        dispatch(updateItem({ id: selectedItem?.id, key, value }));
    };

    return (
        <div className="arrow-selector">
            <select onChange={handleChnage} value={value}>
                <LineTypeOptions />
            </select>
        </div>
    );
};

export default LineTypeSelector;
