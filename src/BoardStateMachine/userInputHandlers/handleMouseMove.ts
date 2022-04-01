import { MouseEvent } from 'react';
import { MouseButton, BoardItem } from '../../interfaces';
import { createItem, updateLineConnections } from '../BoardStateMachineUtils';
import { setCursorPosition, setIsWriting, setHasCursorMoved, setCurrentAction } from '../../store/slices/boardSlice';
import { addItem, setDragSelectedItemIds } from '../../store/slices/itemsSlice';
import { translateCanvas } from '../../store/slices/boardSlice';
import {
    getBoardCoordinates,
    getTranslatedCoordinates,
    getResizedCoordinates,
    getMaxCoordinates,
    isAreaInsideArea,
    isItemDraggable,
} from '../../utils';

import { store } from '../../store/store';
const { dispatch, getState } = store;

function handleMouseMove(e: MouseEvent<HTMLDivElement>): void {
    const { currentAction, cursorPosition, canvasTransform, isWriting, hasCursorMoved, mouseButton } = getState().board;
    const { items, selectedItemId, draggedItemId, dragSelectedItemIds, selectedPoint, dragOffset, lineConnections } =
        getState().items;
    const selectedItem = selectedItemId ? items[selectedItemId] : undefined;

    const [x, y] = [e.clientX, e.clientY];
    const [boardX, boardY] = getBoardCoordinates(x, y, canvasTransform);
    !hasCursorMoved && mouseButton !== undefined && dispatch(setHasCursorMoved(true));

    const updatedItems: BoardItem[] = [];

    if (mouseButton === MouseButton.Left) {
        isWriting && dispatch(setIsWriting(false));
        switch (currentAction) {
            case 'DRAW':
                if (selectedItem?.type === 'drawing') {
                    const points = [...selectedItem.points, [boardX, boardY]] as [number, number][];
                    updatedItems.push({ ...selectedItem, points });
                    dispatch(setCursorPosition([x, y]));
                }
                break;

            case 'DRAG':
                const ids = draggedItemId ? [draggedItemId] : dragSelectedItemIds;
                if (ids.length) {
                    const draggedItems = ids.map((id) => items[id]).filter((item) => isItemDraggable(item, lineConnections));
                    // draggOffset is relative to the whole group when selecting multiple items
                    const { minX, minY } =
                        draggedItems.length > 1
                            ? getMaxCoordinates(draggedItems)
                            : { minX: draggedItems[0].x0, minY: draggedItems[0].y0 };
                    draggedItems.forEach((item) => {
                        const { x0, y0 } = item;
                        const offset = { x: dragOffset.x + minX - x0, y: dragOffset.y + minY - y0 };
                        const updatedItem = {
                            ...item,
                            ...getTranslatedCoordinates(item, offset, boardX, boardY),
                        };
                        updatedItems.push(updatedItem);
                    });
                } else dispatch(setCurrentAction('BLOCKED'));
                dispatch(setCursorPosition([x, y]));
                break;

            case 'RESIZE':
                if (selectedItem && selectedPoint) {
                    const { type } = selectedItem;
                    const maintainRatio = type === 'note' || type === 'drawing';
                    const points = getResizedCoordinates(selectedItem, selectedPoint, x, y, canvasTransform, maintainRatio);
                    const updatedItem = { ...selectedItem, ...points };
                    updatedItems.push(updatedItem);
                } else {
                    // resizing without selectedItem means the item gotta be created
                    createItem(x, y);
                }
                dispatch(setCursorPosition([x, y]));
                break;

            case 'DRAGSELECT':
                let coveredItemIds: string[] = [];
                if (hasCursorMoved) {
                    const areaCoordinates = { x0: dragOffset.x, y0: dragOffset.y, x2: boardX, y2: boardY };
                    const insideItems = Object.values(items).filter((item) => isAreaInsideArea(item, areaCoordinates));
                    coveredItemIds = insideItems.map((item) => item.id);
                }
                if (dragSelectedItemIds.length > 0 && coveredItemIds.length === 0) dispatch(setDragSelectedItemIds());
                else if (coveredItemIds.length) dispatch(setDragSelectedItemIds(coveredItemIds));
                dispatch(setCursorPosition([x, y]));

                break;
        }
        updatedItems.forEach((item) => {
            updateLineConnections(item);
            dispatch(addItem(item));
        });
    } else if (mouseButton === MouseButton.Middle || mouseButton === MouseButton.Right) {
        dispatch(translateCanvas([x - cursorPosition.x, y - cursorPosition.y]));
        dispatch(setCursorPosition([x, y]));
    }
}

export default handleMouseMove;
