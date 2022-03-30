import React, { useMemo, useRef } from 'react';
import { useSelector } from '../../../hooks';
import { BoardItem } from '../../../interfaces';
import { getPositionCSSVars, getItemsMaxCoordinates } from '../../../utils';
import MenuOptions from './MenuOptions/MenuOptions';
import './StylesMenu.scss';

const ITEM_OFFSET = 20; //px ditance to item
const CANVAS_OFFSET = 10; //px min distance to edge of canvas

const StylesMenu = (): React.ReactElement => {
    const menuRef = useRef<HTMLDivElement>(null);
    const { canvasTransform, canvasSize, currentAction } = useSelector((s) => s.board);
    const { items, selectedItemId, dragSelectedItemIds } = useSelector((s) => s.items);

    // stop click events reaching board
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const selectedItems = useMemo(() => {
        const selectedItems: BoardItem[] = [];
        if (selectedItemId) selectedItems.push(items[selectedItemId]);
        else selectedItems.push(...dragSelectedItemIds.map((id) => items[id]));
        return selectedItems;
    }, [items, selectedItemId, dragSelectedItemIds]);

    const [top, left]: [number, number] = useMemo(() => {
        // defualt position outside screen
        let [menuTop, menuLeft] = [-500, -500];

        // calculate position if an item is being edited
        if (selectedItems.length && currentAction === 'EDIT') {
            const coordinates =
                selectedItems.length === 1
                    ? selectedItems[0]
                    : (() => {
                          const maxCoord = getItemsMaxCoordinates(selectedItems);
                          return { x0: maxCoord.minX, x2: maxCoord.maxX, y0: maxCoord.minX, y2: maxCoord.maxY };
                      })();

            const { top, left, width, height } = getPositionCSSVars(canvasTransform, coordinates);
            const menuHeight = menuRef.current?.clientHeight || 0;
            const menuWidth = menuRef.current?.clientWidth || 0;

            // try to have menu above item and centered horizontally
            menuTop = top - ITEM_OFFSET - menuHeight;
            menuLeft = left + (width - menuWidth) / 2;

            // avoid a position where menu goes off screen
            if (menuTop < CANVAS_OFFSET) menuTop = top + ITEM_OFFSET + height;
            if (menuLeft < CANVAS_OFFSET) menuLeft = CANVAS_OFFSET;
            else if (menuLeft + menuWidth > canvasSize.width - CANVAS_OFFSET)
                menuLeft = canvasSize.width - CANVAS_OFFSET - menuWidth;
        }

        return [menuTop, menuLeft];
    }, [selectedItems, canvasTransform, canvasSize, currentAction]);

    return (
        <div ref={menuRef} className="styles-menu" style={{ left, top }} onClick={handleClick} onMouseUp={handleClick}>
            {selectedItems.length && <MenuOptions items={selectedItems} />}
        </div>
    );
};

export default StylesMenu;
