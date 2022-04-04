import { MouseEvent } from 'react';
import { MouseButton, BoardItem } from '../../interfaces';
import { createItem, updateLineConnections } from '../BoardStateMachineUtils';
import { setCursorPosition, setIsWriting, setHasCursorMoved, setCurrentAction } from '../../store/slices/boardSlice';
import { addItem, setDragSelectedItemIds, setDragOffset } from '../../store/slices/itemsSlice';
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
                const selectedItems = ids.map((id) => items[id]);
                const draggabledItems = selectedItems.filter((item) => isItemDraggable(item, lineConnections));
                const updatedLines: BoardItem[] = [];
                const updatedDraggables: BoardItem[] = [];
                if (draggabledItems.length) {
                    // draggOffset is relative to the whole group of items
                    const { minX, minY } =
                        selectedItems.length > 1
                            ? getMaxCoordinates(selectedItems)
                            : { minX: selectedItems[0].x0, minY: selectedItems[0].y0 };
                    // only translate draggable items
                    draggabledItems.forEach((item) => {
                        const { x0, y0 } = item;
                        const offset = { x: dragOffset.x + minX - x0, y: dragOffset.y + minY - y0 };
                        const updatedItem = {
                            ...item,
                            ...getTranslatedCoordinates(item, offset, boardX, boardY),
                        };
                        updatedDraggables.push(updatedItem);
                        updatedLines.push(...updateLineConnections(updatedItem));
                        dispatch(addItem(updatedItem));
                    });
                    // a selection with unmoveable items requires a new dragOffset for each update (lines grow when selection is moved)
                    const updatedLinesOnSelection = updatedLines.filter((line) => ids.includes(line.id));
                    if (updatedLinesOnSelection.length) {
                        const updatedSelection = [...updatedDraggables, ...updatedLinesOnSelection];
                        const { minX, minY } = getMaxCoordinates(updatedSelection);
                        dispatch(setDragOffset([boardX - minX, boardY - minY]));
                    }
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
