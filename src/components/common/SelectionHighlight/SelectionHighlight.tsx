import React, { useMemo } from 'react';
import { useSelector } from '../../../hooks';
import { getPositionCSSVars, getMaxCoordinates } from '../../../utils';
import './SelectionHighlight.scss';

const SelectionHighlight = (): React.ReactElement => {
    const { items, dragSelectedItemIds } = useSelector((s) => s.items);
    const { canvasTransform } = useSelector((s) => s.board);

    const cssVars = useMemo(() => {
        if (!dragSelectedItemIds.length) return [];
        const itemsToHighlight = dragSelectedItemIds.map((id) => items[id]);
        const itemVars = itemsToHighlight.map((item) => getPositionCSSVars(canvasTransform, item, true));
        const { maxX, maxY, minX, minY } = getMaxCoordinates(itemsToHighlight);
        itemVars.push(getPositionCSSVars(canvasTransform, { x0: minX, y0: minY, x2: maxX, y2: maxY }, true));
        return itemVars;
    }, [items, dragSelectedItemIds, canvasTransform]);

    return (
        <span className="selection-highlights-container">
            {cssVars.map((vars, index) => (
                <span key={index} className="selection-highlight" style={{ ...vars }} />
            ))}
        </span>
    );
};
export default SelectionHighlight;
