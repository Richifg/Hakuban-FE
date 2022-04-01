import { MouseEvent } from 'react';
import { MouseButton, BoardItem } from '../../interfaces';
import { setNoteStyle } from '../../store/slices/toolSlice';
import { addItem, setDraggedItemId, setSelectedItemId, setDragSelectedItemIds } from '../../store/slices/itemsSlice';
import { setCurrentAction, setCursorPosition, setIsWriting, setBoardLimits, setMouseButton } from '../../store/slices/boardSlice';
import { isPointInsideArea, isMainPoint, getBoardCoordinates, getFinishedDrawing, getUpdatedBoardLimits } from '../../utils';
import { createItem, disconnectItem, connectItem } from '../BoardStateMachineUtils';

import { store } from '../../store/store';
const { dispatch, getState } = store;

function handleMouseUp(e: MouseEvent<HTMLDivElement>): void {
    const { selectedTool } = getState().tools;
    const { items, selectedItemId, selectedPoint, dragSelectedItemIds, draggedItemId } = getState().items;
    const { currentAction, canvasTransform, isWriting, hasCursorMoved } = getState().board;
    const selectedItem = selectedItemId ? items[selectedItemId] : undefined;

    const [screenX, screenY] = [e.clientX, e.clientY];
    dispatch(setCursorPosition([screenX, screenY]));
    dispatch(setMouseButton());

    const [boardX, boardY] = getBoardCoordinates(screenX, screenY, canvasTransform);
    const clickedItem = Object.values(items).find((item) => isPointInsideArea(boardX, boardY, item));

    let editedItem: BoardItem | undefined = undefined;
    if (e.button === MouseButton.Left) {
        switch (currentAction) {
            case 'IDLE':
                if (selectedTool === 'NOTE') createItem(screenX, screenY);
                break;

            case 'DRAW':
                if (selectedItem?.type === 'drawing') {
                    // transformed in-progress drawing into relative coordinates drawing
                    const finishedDrawing = getFinishedDrawing(selectedItem);
                    editedItem = finishedDrawing;
                    dispatch(addItem(finishedDrawing));
                    dispatch(setBoardLimits(getUpdatedBoardLimits(finishedDrawing)));
                    dispatch(setCurrentAction('IDLE'));
                }
                break;

            case 'DRAG':
                if (draggedItemId) {
                    dispatch(setDraggedItemId());
                    if (!hasCursorMoved) {
                        // click on top of an item without moving cursor means the item has to be selected
                        if (clickedItem && clickedItem !== selectedItem) dispatch(setSelectedItemId(clickedItem.id));
                        else !isWriting && dispatch(setIsWriting(true));
                        dispatch(setCurrentAction('EDIT'));
                    } else {
                        // otherwise an item was dragged and could be editted
                        editedItem = clickedItem;
                        if (selectedItemId) dispatch(setCurrentAction('EDIT'));
                        else dispatch(setCurrentAction('IDLE'));
                    }
                } else if (dragSelectedItemIds.length) dispatch(setCurrentAction('EDIT'));
                break;

            case 'RESIZE':
                editedItem = selectedItem;
                if (selectedTool === 'NOTE' && selectedItem?.type === 'note') {
                    // resizing an Note involves updating preffered Note size
                    const { fillColor } = selectedItem;
                    const size = Math.abs(selectedItem.x2 - selectedItem.x0);
                    dispatch(setNoteStyle({ fillColor, size }));
                } else if (selectedItem?.type === 'line' && isMainPoint(selectedPoint)) {
                    // only connect Lines to other non-Line items
                    if (clickedItem && clickedItem.type !== 'line')
                        connectItem(clickedItem, selectedItem, selectedPoint, boardX, boardY);
                    else disconnectItem(selectedItem, selectedPoint);
                }
                dispatch(setCurrentAction('EDIT'));
                break;

            case 'DRAGSELECT':
                // if cursor moved then multiple items might have been selected
                if (hasCursorMoved) {
                    isWriting && dispatch(setIsWriting(false));
                    if (dragSelectedItemIds.length) {
                        dragSelectedItemIds.length === 1 && dispatch(setSelectedItemId(dragSelectedItemIds[0]));
                        dispatch(setCurrentAction('EDIT'));
                    } else {
                        selectedItem && dispatch(setSelectedItemId());
                        dispatch(setCurrentAction('IDLE'));
                    }
                } else if (clickedItem) {
                    dispatch(setSelectedItemId(clickedItem.id));
                    dispatch(setCurrentAction('EDIT'));
                } else if (dragSelectedItemIds) {
                    dispatch(setDragSelectedItemIds());
                    dispatch(setCurrentAction('IDLE'));
                }
                break;
        }
    } else if (e.button === MouseButton.Middle || e.button === MouseButton.Right) {
        if (currentAction === 'PAN') {
            dispatch(setCurrentAction('SLIDE'));
        }
    }
    // board limits are not updated until user mouseUp
    if (editedItem) dispatch(setBoardLimits(getUpdatedBoardLimits(editedItem)));
}

export default handleMouseUp;
