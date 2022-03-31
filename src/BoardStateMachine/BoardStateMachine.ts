import { MouseEvent, WheelEvent } from 'react';
import { MouseButton, BoardItem } from '../interfaces';
import {
    setCurrentAction,
    setCursorPosition,
    setIsWriting,
    setBoardLimits,
    setCanvasScale,
    setCanvasSize,
    setHasCursorMoved,
    setMouseButton,
} from '../store/slices/boardSlice';
import { translateCanvas } from '../store/slices/boardSlice';
import { setNoteStyle } from '../store/slices/toolSlice';
import { addItem, setDragOffset, setDraggedItemId, setSelectedItemId, setDragSelectedItemIds } from '../store/slices/itemsSlice';
import {
    isPointInsideArea,
    isMainPoint,
    getCanvasCoordinates,
    getBoardCoordinates,
    getTranslatedCoordinates,
    getResizedCoordinates,
    getFinishedDrawing,
    getUpdatedBoardLimits,
    getMaxCoordinates,
} from '../utils';

import { store } from '../store/store';
import createItem from './createItem';
import connectItem from './connectItem';
import disconnectItem from './disconnectItem';
import updateLineConnections from './updateLineConnections';
import isAreaInsideArea from '../utils/isAreaInsideArea';

const { dispatch, getState } = store;

/* 
    Board is in one of many possible states (IDLE, PAN, DRAG, DRAW, etc)
    State machine does the following:
        - receives user inputs like mouse, wheel and window resize events
        - reads current state and other variables from various store slices (e.g. selectedTool)
        - dispatches store actions to keep board and items updated
        - sets the new state
*/

const BoardStateMachine = {
    mouseDown(e: MouseEvent<HTMLDivElement>): void {
        const { canvasTransform } = getState().board;
        const { items, selectedItemId, lineConnections, dragSelectedItemIds } = getState().items;
        const { selectedTool } = getState().tools;

        const [screenX, screenY] = [e.clientX, e.clientY];
        dispatch(setCursorPosition([screenX, screenY]));
        dispatch(setHasCursorMoved(false));
        dispatch(setMouseButton(e.button));

        if (e.button === MouseButton.Left) {
            switch (selectedTool) {
                case 'POINTER':
                    const [boardX, boardY] = getBoardCoordinates(screenX, screenY, canvasTransform);

                    if (dragSelectedItemIds.length) {
                        const draggableItems = dragSelectedItemIds.map((id) => items[id]);
                        const { minX, maxX, minY, maxY } = getMaxCoordinates(draggableItems);
                        if (isPointInsideArea(boardX, boardY, { x0: minX, x2: maxX, y0: minY, y2: maxY })) {
                            // has group of selected items and mouseDown within the the group
                            dispatch(setDragOffset([boardX - minX, boardY - minY]));
                            dispatch(setCurrentAction('DRAG'));
                        } else {
                            // has a group of selected items but clicked outside
                            dispatch(setCurrentAction('IDLE'));
                            dispatch(setDragSelectedItemIds());
                        }
                    } else {
                        const clickedItem = Object.values(items).find((item) => isPointInsideArea(boardX, boardY, item));
                        // check if mouseDown on top of a draggable item
                        if (clickedItem && (clickedItem.type !== 'line' || !lineConnections[clickedItem.id])) {
                            dispatch(setDragOffset([boardX - clickedItem.x0, boardY - clickedItem.y0]));
                            dispatch(setDraggedItemId(clickedItem.id));
                            dispatch(setCurrentAction('DRAG'));
                            // deselect item if dragging a different one
                            if (clickedItem.id !== selectedItemId) dispatch(setSelectedItemId());
                        } else {
                            // dragSelect only happens if nothing was clicked and there was no previous selection
                            dispatch(setDragOffset([boardX, boardY]));
                            dispatch(setCurrentAction('DRAGSELECT'));
                        }
                    }
                    break;

                case 'NOTE':
                    // notes are created on mouseUp
                    selectedItemId && dispatch(setSelectedItemId());
                    dispatch(setCurrentAction('IDLE'));
                    break;

                default:
                    // all other tools make items that need resize on creation
                    selectedItemId && dispatch(setSelectedItemId());
                    dispatch(setCurrentAction('RESIZE'));
            }
        } else if (e.button === MouseButton.Middle || e.button === MouseButton.Right) {
            dispatch(setCurrentAction('PAN'));
        }
    },

    mouseMove(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, cursorPosition, canvasTransform, isWriting, hasCursorMoved, mouseButton } = getState().board;
        const { items, selectedItemId, draggedItemId, dragSelectedItemIds, selectedPoint, dragOffset } = getState().items;
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
                    const draggedItems = ids.map((id) => items[id]);
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
    },

    mouseUp(e: MouseEvent<HTMLDivElement>): void {
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
    },

    mouseWheel(e: WheelEvent<HTMLDivElement>): void {
        const { canvasTransform, currentAction } = getState().board;
        if (currentAction !== 'IDLE') dispatch(setCurrentAction('IDLE'));
        // calculate new scale, clamped between 4% and 400%
        const scale = Math.min(Math.max(canvasTransform.scale * (1 - Math.round(e.deltaY) * 0.001), 0.04), 4);
        dispatch(setCanvasScale(scale));
        // get cursor board coordinates
        const [cursorX, cursorY] = [e.clientX, e.clientY];
        const [boardX, boardY] = getBoardCoordinates(cursorX, cursorY, canvasTransform);
        // position coordinates on canvas using the new scale
        const [newX, newY] = getCanvasCoordinates(boardX, boardY, { ...canvasTransform, scale });
        // translate so the cursor stays on same position on screen
        dispatch(translateCanvas([cursorX - newX, cursorY - newY]));
    },

    windowResize(): void {
        dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
    },
};

export default BoardStateMachine;
