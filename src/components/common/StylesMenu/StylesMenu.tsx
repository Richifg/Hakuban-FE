import React, { useMemo, useRef } from 'react';
import { useSelector } from '../../../hooks';
import { getItemPositionCSSVars } from '../../../utils';
import MenuOptions from './MenuOptions/MenuOptions';
import './StylesMenu.scss';

const ITEM_OFFSET = 20; //px ditance to item
const CANVAS_OFFSET = 10; //px min distance to edge of canvas

const StylesMenu = (): React.ReactElement => {
    const { canvasTransform, canvasSize, currentAction } = useSelector((s) => s.board);
    const { selectedItem } = useSelector((s) => s.items);
    const menuRef = useRef<HTMLDivElement>(null);

    const [top, left]: [number, number] = useMemo(() => {
        // defualt position outside screen
        let [menuTop, menuLeft] = [-500, -500];

        // calculate position if an item is being edited
        if (selectedItem && currentAction === 'EDIT') {
            const { x0, y0, x2, y2 } = selectedItem;
            const { top, left, width, height } = getItemPositionCSSVars(canvasTransform, { x0, y0, x2, y2 });
            const { scale } = canvasTransform;
            const menuHeight = menuRef.current?.clientHeight || 0;
            const menuWidth = menuRef.current?.clientWidth || 0;

            // try to have menu above item and centered horizontally
            menuTop = top - ITEM_OFFSET - menuHeight;
            menuLeft = left + (width * scale - menuWidth) / 2;

            // avoid a position where menu goes off screen
            if (menuTop < CANVAS_OFFSET) menuTop = top + ITEM_OFFSET + height * scale;
            if (menuLeft < CANVAS_OFFSET) menuLeft = CANVAS_OFFSET;
            else if (menuLeft + menuWidth > canvasSize.width - CANVAS_OFFSET)
                menuLeft = canvasSize.width - CANVAS_OFFSET - menuWidth;
        }

        return [menuTop, menuLeft];
    }, [selectedItem, canvasTransform, canvasSize, currentAction]);

    return (
        <div ref={menuRef} className="styles-menu" style={{ left, top }}>
            {selectedItem && <MenuOptions item={selectedItem} />}
        </div>
    );
};

export default StylesMenu;
