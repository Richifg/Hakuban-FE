import React, { useMemo } from 'react';
import { useSelector } from '../../../hooks';
import { getPositionCSSVars, getMaxCoordinates } from '../../../utils';
import './SelectionHighlight.scss';

const SelectionHighlight = (): React.ReactElement => {
    const { items, selectedItemIds } = useSelector((s) => s.items);
    const { canvasTransform } = useSelector((s) => s.board);

    const cssVars = useMemo(() => {
        if (!selectedItemIds.length) return [];
        const vars: ReturnType<typeof getPositionCSSVars>[] = [];
        const itemsToHighlight = selectedItemIds.map((id) => items[id]);
        if (itemsToHighlight.length < 5) {
            vars.push(...itemsToHighlight.map((item) => getPositionCSSVars(canvasTransform, item, true)));
        }
        const { maxX, maxY, minX, minY } = getMaxCoordinates(itemsToHighlight);
        vars.push(getPositionCSSVars(canvasTransform, { x0: minX, y0: minY, x2: maxX, y2: maxY }, true));
        return vars;
    }, [items, selectedItemIds, canvasTransform]);

    return (
        <span className="selection-highlights-container">
            {cssVars.map((vars, index) => (
                <span key={index} className="selection-highlight" style={{ ...vars }} />
            ))}
        </span>
    );
};
export default SelectionHighlight;
