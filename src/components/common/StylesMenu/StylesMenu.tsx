import React, { useMemo, useRef } from 'react';
import { useSelector } from '../../../hooks';
import { getItemPositionCSSVars } from '../../../utils';
import './StylesMenu.scss';

const ITEM_OFFSET = 20; //px
const CANVAS_OFFSET = 10; //px

const StylesMenu = (): React.ReactElement => {
    const { canvasTransform, canvasSize, currentAction } = useSelector((s) => s.board);
    const { selectedItem } = useSelector((s) => s.items);
    const menuRef = useRef<HTMLDivElement>(null);

    const [top, left]: [number, number] = useMemo(() => {
        // ##TODO better way to hide this??
        if (!selectedItem || currentAction !== 'EDIT') return [-500, -500];

        const { top, left, width, height } = getItemPositionCSSVars(canvasTransform, selectedItem);
        const { scale } = canvasTransform;
        const menuHeight = menuRef.current?.clientHeight || 0;
        const menuWidth = menuRef.current?.clientWidth || 0;

        let menuTop = top - ITEM_OFFSET - menuHeight;
        if (menuTop < CANVAS_OFFSET) menuTop = top + ITEM_OFFSET + height * scale;

        let menuLeft = left + (width * scale - menuWidth) / 2;
        if (menuLeft < CANVAS_OFFSET) menuLeft = CANVAS_OFFSET;
        else if (menuLeft + menuWidth > canvasSize.width - CANVAS_OFFSET) menuLeft = canvasSize.width - CANVAS_OFFSET - menuWidth;

        return [menuTop, menuLeft];
    }, [selectedItem, canvasTransform, canvasSize, currentAction]);

    return <div ref={menuRef} className="styles-menu" style={{ left, top }}></div>;
};

export default StylesMenu;
