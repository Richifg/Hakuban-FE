import { MouseEvent } from 'react';
import { MouseButton, BoardItem } from '../../interfaces';
import { updateLineConnections, connectItem } from '../BoardStateMachineUtils';
import { setCursorPosition, setIsWriting, setHasCursorMoved, setCurrentAction } from '../../store/slices/boardSlice';
import {
    addItem,
    setDragSelectedItemIds,
    setDragOffset,
    setSelectedPoint,
    setSelectedItemId,
} from '../../store/slices/itemsSlice';
import { translateCanvas } from '../../store/slices/boardSlice';
import {
    getBoardCoordinates,
    getTranslatedCoordinates,
    getResizedCoordinates,
    getMaxCoordinates,
    getNewItem,
    isAreaInsideArea,
    isItemDraggable,
    getItemAtPosition,
} from '../../utils';

import { store } from '../../store/store';
const { dispatch, getState } = store;

function handleMouseMove(e: MouseEvent<HTMLDivElement>): void {
    const { selectedTool } = getState().tools;
    const { currentAction, cursorPosition, canvasTransform, isWriting, hasCursorMoved, mouseButton } = getState().board;
    const { items, selectedItemId, draggedItemId, dragSelectedItemIds, selectedPoint, dragOffset, lineConnections } =
        getState().items;
    const selectedItem = selectedItemId ? items[selectedItemId] : undefined;

    const [x, y] = [e.clientX, e.clientY];
    dispatch(setCursorPosition([x, y]));

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
                }
                break;

            case 'DRAG':
                const ids = draggedItemId ? [draggedItemId] : dragSelectedItemIds;
                const selectedItems = ids.map((id) => items[id]);
                const draggabledItems = selectedItems.filter((item) => isItemDraggable(item, lineConnections));
                const updatedLines: BoardItem[] = [];
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
                        updatedLines.push(...updateLineConnections(updatedItem));
                        updatedItems.push(updatedItem);
                    });

                    // a selection with unmoveable items requires a new dragOffset for each update (lines grow when selection is moved)
                    const updatedLinesOnSelection = updatedLines.filter((line) => ids.includes(line.id));
                    if (updatedLinesOnSelection.length) {
                        const updatedSelection = [...updatedItems, ...updatedLinesOnSelection];
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
                    updateLineConnections(updatedItem, true);
                    updatedItems.push(updatedItem);
                } else {
                    // resizing without selectedItem means the item's gotta be created first
                    let newItem: BoardItem | undefined = undefined;
                    if (selectedTool === 'SHAPE') {
                        newItem = getNewItem(boardX, boardY, 0, 'shape');
                        dispatch(setSelectedPoint('P2'));
                        dispatch(setCurrentAction('RESIZE'));
                    } else if (selectedTool === 'PEN') {
                        newItem = getNewItem(boardX, boardY, 0, 'drawing');
                        dispatch(setCurrentAction('DRAW'));
                    } else if (selectedTool === 'LINE') {
                        newItem = getNewItem(boardX, boardY, 0, 'line');
                        // when creating a line it could be connected to an item right away
                        const itemUnderCursor = getItemAtPosition(boardX, boardY, Object.values(items));
                        if (itemUnderCursor) connectItem(itemUnderCursor, newItem, 'P0', boardX, boardY);
                        dispatch(setSelectedPoint('P2'));
                        dispatch(setCurrentAction('RESIZE'));
                    }
                    if (newItem) {
                        dispatch(addItem({ ...newItem, inProgress: true }));
                        dispatch(setSelectedItemId(newItem.id));
                    }
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
        // make all edited items in-progress so they are not synced with BE
        updatedItems.forEach((item) => {
            dispatch(addItem({ ...item, inProgress: true }));
        });
    } else if (mouseButton === MouseButton.Middle || mouseButton === MouseButton.Right) {
        // middle and right buttons always pan camera
        dispatch(translateCanvas([x - cursorPosition.x, y - cursorPosition.y]));
    }
}

export default handleMouseMove;