import React from 'react';
import ArrowOptions from './ArrowOptions';
import { useSelector, useDispatch } from '../../../../../hooks';
import { updateItem } from '../../../../../store/slices/itemsSlice';
import { ArrowType, LineStyle } from '../../../../../interfaces';
import './ArrowSelector.scss';

const key0: keyof LineStyle = 'arrow0Type';
const key2: keyof LineStyle = 'arrow2Type';

interface ArrowSelector {
    arrow0Type?: ArrowType;
    arrow2Type?: ArrowType;
}

const ArrowSelector = ({ arrow0Type = 'none', arrow2Type = 'none' }: ArrowSelector): React.ReactElement => {
    const dispatch = useDispatch();
    const { selectedItem } = useSelector((s) => s.items);

    const handleArrowChange = (index: 0 | 2) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const key: keyof LineStyle = `arrow${index}Type` as const;
        const { value } = e.currentTarget;
        dispatch(updateItem({ id: selectedItem?.id, key, value }));
    };

    const handleSwap = () => {
        dispatch(updateItem({ id: selectedItem?.id, key: key0, value: arrow2Type }));
        dispatch(updateItem({ id: selectedItem?.id, key: key2, value: arrow0Type }));
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
