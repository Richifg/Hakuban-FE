import { MouseEvent } from 'react';
import { setNoteStyle } from '../../store/slices/toolSlice';
import { setDraggedItemId, setInProgress } from '../../store/slices/itemsSlice';
import { setCurrentAction, setIsWriting, setMouseButton } from '../../store/slices/boardSlice';
import { isMainPoint, getBoardCoordinates, getRelativeDrawing, getItemAtPosition, getNewItem } from '../../utils';
import { MouseButton, BoardItem, UpdateData } from '../../interfaces';

import { disconnectItem, connectItem, processItemUpdates, selectItems, selectQuickDragItem } from '../BoardStateMachineUtils';

import { store } from '../../store/store';
const { dispatch, getState } = store;

function handleMouseUp(e: MouseEvent): void {
    const { selectedTool } = getState().tools;
    const { items, selectedItemIds, selectedPoint } = getState().items;
    const { currentAction, canvasTransform, isWriting, hasCursorMoved } = getState().board;

    const selectedItem = selectedItemIds.length === 1 ? items[selectedItemIds[0]] : undefined;

    dispatch(setMouseButton());
    const [boardX, boardY] = getBoardCoordinates(e.clientX, e.clientY, canvasTransform);

    const itemUpdates: (BoardItem | UpdateData)[] = [];
    let idsToSelect: string[] = [];
    let hasSelectionChanged = false;
    let shouldCleanQuickDrag = false;

    if (e.button === MouseButton.Left) {
        switch (currentAction) {
            case 'IDLE':
                if (selectedTool === 'NOTE') {
                    const note = getNewItem(boardX, boardY, 'note');
                    itemUpdates.push(note);
                    dispatch(setCurrentAction('EDIT'));
                }
                break;

            case 'DRAW':
                if (selectedItem?.type === 'drawing') {
                    // transform in-progress drawing into relative coordinates drawing
                    const finishedDrawing = getRelativeDrawing(selectedItem);
                    itemUpdates.push(finishedDrawing);
                    dispatch(setCurrentAction('IDLE'));
                }
                break;

            case 'DRAG':
                if (hasCursorMoved) {
                    // edit the selected moved item
                    if (selectedItemIds.length) dispatch(setCurrentAction('EDIT'));
                    else {
                        // finish the quick drag but hold unlock after item is updated
                        shouldCleanQuickDrag = true;
                        dispatch(setCurrentAction('IDLE'));
                    }
                } else {
                    // check if item under cursor is the same as the selectedItem
                    const itemUnderCursor = getItemAtPosition(boardX, boardY, Object.values(items));
                    if (itemUnderCursor) {
                        if (selectedItem?.id === itemUnderCursor.id) {
                            // same item clicked twice starts a writing
                            dispatch(setIsWriting(true));
                        } else {
                            // clicking a different item requires selection update
                            idsToSelect = [itemUnderCursor.id];
                            hasSelectionChanged = true;
                            // manually deselected quick drag item without unlocking (it will now be selected)
                            dispatch(setDraggedItemId());
                        }
                        dispatch(setCurrentAction('EDIT'));
                    }
                }
                break;

            case 'RESIZE':
                if (selectedItem?.type === 'note') {
                    // resizing an Note involves updating preffered Note size
                    const { fillColor } = selectedItem;
                    const size = Math.abs(selectedItem.x2 - selectedItem.x0);
                    dispatch(setNoteStyle({ fillColor, size }));
                } else if (selectedItem?.type === 'line' && isMainPoint(selectedPoint)) {
                    // get the first item under cursor which is not selected
                    const itemUnderCursor = getItemAtPosition(boardX, boardY, Object.values(items), [selectedItem]);

                    // only connect Lines to other non-Line items
                    const connectionUpdates: (UpdateData | undefined)[] = [];
                    if (itemUnderCursor && itemUnderCursor.type !== 'line') {
                        connectionUpdates.push(...connectItem(itemUnderCursor, selectedItem, selectedPoint, boardX, boardY));
                    } else connectionUpdates.push(disconnectItem(selectedItem, selectedPoint));
                    connectionUpdates.length && itemUpdates.push(...(connectionUpdates.filter((i) => !!i) as UpdateData[]));
                }
                dispatch(setCurrentAction('EDIT'));
                break;

            case 'DRAGSELECT':
                hasSelectionChanged = true;
                // if cursor moved then multiple items might have been selected
                if (hasCursorMoved) {
                    idsToSelect = selectedItemIds;
                    dispatch(setCurrentAction(selectedItemIds.length ? 'EDIT' : 'IDLE'));
                } else {
                    idsToSelect = [];
                    dispatch(setCurrentAction('IDLE'));
                }
                isWriting && dispatch(setIsWriting(false));
                break;

            case 'BLOCKED':
                if (selectedItemIds.length) dispatch(setCurrentAction('EDIT'));
                else dispatch(setCurrentAction('IDLE'));
                break;
        }
        // allow BE sync
        dispatch(setInProgress(false));

        // before updating, lock items
        if (hasSelectionChanged) selectItems(idsToSelect);

        processItemUpdates(itemUpdates);

        // after updating, clear quick drag item
        if (shouldCleanQuickDrag) selectQuickDragItem();
    } else if (e.button === MouseButton.Middle || e.button === MouseButton.Right) {
        if (currentAction === 'PAN') {
            dispatch(setCurrentAction('SLIDE'));
        }
    }
}

export default handleMouseUp;
