import { MouseEvent } from 'react';
import { MouseButton } from '../../interfaces';
import {
    setCurrentAction,
    setCursorPosition,
    setHasCursorMoved,
    setIsWriting,
    setMouseButton,
} from '../../store/slices/boardSlice';
import { setDragOffset, setInProgress } from '../../store/slices/itemsSlice';
import { isPointInsideArea, getBoardCoordinates, getMaxCoordinates, isItemDraggable, getItemAtPosition } from '../../utils';
import { selectItems, selectQuickDragItem } from '../BoardStateMachineUtils';

import { store } from '../../store/store';
const { dispatch, getState } = store;

function handleMouseDown(e: MouseEvent<HTMLDivElement>): void {
    const { canvasTransform, isWriting, hasCursorMoved } = getState().board;
    const { items, lineConnections, selectedItemIds } = getState().items;
    const { selectedTool } = getState().tools;

    const [screenX, screenY] = [e.clientX, e.clientY];
    dispatch(setCursorPosition([screenX, screenY]));
    hasCursorMoved && dispatch(setHasCursorMoved(false));
    dispatch(setMouseButton(e.button));
    dispatch(setInProgress(true));

    if (e.button === MouseButton.Left) {
        switch (selectedTool) {
            case 'POINTER':
                const [boardX, boardY] = getBoardCoordinates(screenX, screenY, canvasTransform);
                let clickedOutside = true;

                if (selectedItemIds.length) {
                    const selectedItems = selectedItemIds.map((id) => items[id]);
                    const { minX, maxX, minY, maxY } = getMaxCoordinates(selectedItems);
                    if (isPointInsideArea(boardX, boardY, { x0: minX, x2: maxX, y0: minY, y2: maxY })) {
                        // has selected items and clicked within the the group
                        clickedOutside = false;
                        // use only draggables items for setting the dragOffset
                        const draggbleItems = selectedItems.filter((item) => isItemDraggable(item, lineConnections));
                        const { minX, minY } = getMaxCoordinates(draggbleItems);
                        dispatch(setDragOffset([boardX - minX, boardY - minY]));
                        dispatch(setCurrentAction('DRAG'));
                    } else {
                        // deselect previously selected items
                        selectItems();
                        isWriting && dispatch(setIsWriting(false));
                    }
                }
                if (!selectedItemIds.length || clickedOutside) {
                    const clickedItem = getItemAtPosition(boardX, boardY, Object.values(items));
                    if (clickedItem) {
                        // clicked an item so might be starting a quick drag
                        if (isItemDraggable(clickedItem, lineConnections)) {
                            const { minX, minY } = getMaxCoordinates(clickedItem);
                            dispatch(setDragOffset([boardX - minX, boardY - minY]));
                            selectQuickDragItem(clickedItem.id);
                        } else {
                            // dont set draggedItemId if not draggable
                            // a mouse move attempt will result in BLOCKED action
                            selectQuickDragItem();
                        }
                        dispatch(setCurrentAction('DRAG'));
                    } else {
                        // nothing was clicked, starting a drag select
                        dispatch(setDragOffset([boardX, boardY]));
                        dispatch(setCurrentAction('DRAGSELECT'));
                        isWriting && dispatch(setIsWriting(false));
                    }
                }
                break;

            case 'NOTE':
                // notes are created on mouseUp
                selectItems();
                dispatch(setCurrentAction('IDLE'));
                break;

            default:
                // all other tools make items that need resize on creation
                selectItems();
                dispatch(setCurrentAction('RESIZE'));
        }
    } else if (e.button === MouseButton.Middle || e.button === MouseButton.Right) {
        dispatch(setCurrentAction('PAN'));
    }
}

export default handleMouseDown;
