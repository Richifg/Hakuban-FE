import React, { useMemo, useRef, useState } from 'react';
import { useSelector } from '../../../hooks';
import { getPositionCSSVars, getMaxCoordinates } from '../../../utils';
import { MENU_ITEM_OFFSET, MENU_BOARD_OFFSET } from '../../../constants';
import MenuOptions from './MenuOptions/MenuOptions';
import './StylesMenu.scss';

const StylesMenu = (): React.ReactElement => {
    const menuRef = useRef<HTMLDivElement>(null);
    const { canvasTransform, canvasSize, currentAction } = useSelector((s) => s.board);
    const { items, selectedItemIds } = useSelector((s) => s.items);
    // flag to avoid calculating menu position without menu having full size
    const [calculatePosition, setCalculatePosition] = useState(false);

    // stop click events from reaching board
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const selectedItems = useMemo(() => {
        const selectedItems = selectedItemIds.map((id) => items[id]);
        setCalculatePosition(false);
        return selectedItems;
    }, [items, selectedItemIds]);

    const [top, left]: [number, number] = useMemo(() => {
        // defualt position outside screen
        let [menuTop, menuLeft] = [-500, -500];

        // calculate position if an item is being edited
        if (selectedItems.length && currentAction === 'EDIT' && calculatePosition) {
            const coordinates =
                selectedItems.length === 1
                    ? selectedItems[0]
                    : (() => {
                          const maxCoord = getMaxCoordinates(selectedItems);
                          return { x0: maxCoord.minX, x2: maxCoord.maxX, y0: maxCoord.minY, y2: maxCoord.maxY };
                      })();

            const { top, left, width, height } = getPositionCSSVars(canvasTransform, coordinates, true);
            const menuHeight = menuRef.current?.clientHeight || 0;
            const menuWidth = menuRef.current?.clientWidth || 0;

            // try to have menu above item and centered horizontally
            menuTop = top - MENU_ITEM_OFFSET - menuHeight;
            menuLeft = left + (width - menuWidth) / 2;

            // avoid a position where menu goes off screen
            if (menuTop < MENU_BOARD_OFFSET) menuTop = top + MENU_ITEM_OFFSET + height;
            if (menuLeft < MENU_BOARD_OFFSET) menuLeft = MENU_BOARD_OFFSET;
            else if (menuLeft + menuWidth > canvasSize.width - MENU_BOARD_OFFSET)
                menuLeft = canvasSize.width - MENU_BOARD_OFFSET - menuWidth;
        }

        return [menuTop, menuLeft];
    }, [selectedItems, canvasTransform, canvasSize, currentAction, calculatePosition]);

    return (
        <div ref={menuRef} className="styles-menu" style={{ left, top }} onClick={handleClick} onMouseUp={handleClick}>
            {selectedItems.length && <MenuOptions items={selectedItems} onRender={() => setCalculatePosition(true)} />}
        </div>
    );
};

export default StylesMenu;
