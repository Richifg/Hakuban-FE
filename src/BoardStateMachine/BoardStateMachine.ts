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
import { addItem, setDragOffset, setDraggedItem, setSelectedItem } from '../store/slices/itemsSlice';
import {
    isPointInsideItem,
    isMainPoint,
    getCanvasCoordinates,
    getBoardCoordinates,
    getItemTranslatePoints,
    getItemResizePoints,
    getFinishedDrawing,
    getUpdatedBoardLimits,
} from '../utils';

import { store } from '../store/store';
import createItem from './createItem';
import connectItem from './connectItem';
import disconnectItem from './disconnectItem';
import updateLineConnections from './updateLineConnections';

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
        const { items, selectedItem, lineConnections } = getState().items;
        const { selectedTool } = getState().tools;

        const [screenX, screenY] = [e.clientX, e.clientY];
        dispatch(setCursorPosition([screenX, screenY]));
        dispatch(setHasCursorMoved(false));
        dispatch(setMouseButton(e.button));

        if (e.button === MouseButton.Left) {
            switch (selectedTool) {
                case 'POINTER':
                    const [boardX, boardY] = getBoardCoordinates(screenX, screenY, canvasTransform);
                    const clickedItem = Object.values(items).find((item) => isPointInsideItem(boardX, boardY, item));
                    // only drag if clicked item isnt a line with connections
                    if (clickedItem && (clickedItem.type !== 'line' || !lineConnections[clickedItem.id])) {
                        dispatch(setDragOffset([boardX - clickedItem.x0, boardY - clickedItem.y0]));
                        dispatch(setDraggedItem(clickedItem));
                        dispatch(setCurrentAction('DRAG'));
                        if (selectedItem !== clickedItem) dispatch(setSelectedItem());
                    } else {
                        dispatch(setDragOffset([boardX, boardY]));
                        dispatch(setCurrentAction('DRAGSELECT'));
                    }
                    break;

                case 'NOTE':
                    // notes are on mouseUp
                    selectedItem && dispatch(setSelectedItem());
                    dispatch(setCurrentAction('IDLE'));
                    break;

                default:
                    // all other tools make items that need resize on creation
                    selectedItem && dispatch(setSelectedItem());
                    dispatch(setCurrentAction('RESIZE'));
            }
        } else if (e.button === MouseButton.Middle || e.button === MouseButton.Right) {
            dispatch(setCurrentAction('PAN'));
        }
    },

    mouseMove(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, cursorPosition, canvasTransform, isWriting, hasCursorMoved, mouseButton } = getState().board;
        const { selectedItem, selectedPoint, draggedItem, dragOffset } = getState().items;

        const [x, y] = [e.clientX, e.clientY];
        !hasCursorMoved && dispatch(setHasCursorMoved(true));
        if (currentAction !== 'IDLE') dispatch(setCursorPosition([x, y]));

        if (mouseButton === MouseButton.Left) {
            isWriting && dispatch(setIsWriting(false));
            switch (currentAction) {
                case 'DRAW':
                    if (selectedItem?.type === 'drawing') {
                        const [boardX, boardY] = getBoardCoordinates(x, y, canvasTransform);
                        const points = [...selectedItem.points, [boardX, boardY]] as [number, number][];
                        dispatch(addItem({ ...selectedItem, points }));
                    }
                    break;

                case 'DRAG':
                    if (draggedItem) {
                        // ## TODO gotta drag all selectedItems
                        const updatedItem = {
                            ...draggedItem,
                            ...getItemTranslatePoints(draggedItem, dragOffset, x, y, canvasTransform),
                        };
                        dispatch(addItem(updatedItem));
                        updateLineConnections(updatedItem);
                    }
                    break;

                case 'RESIZE':
                    if (selectedItem && selectedPoint) {
                        // ## TODO gotta resize all selectedItems
                        const { type } = selectedItem;
                        const maintainRatio = type === 'note' || type === 'drawing';
                        const points = getItemResizePoints(selectedItem, selectedPoint, x, y, canvasTransform, maintainRatio);
                        const updatedItem = { ...selectedItem, ...points };
                        dispatch(addItem(updatedItem));
                        updateLineConnections(updatedItem);
                    } else {
                        // resizing without selectedItem means the item gotta be created
                        createItem(x, y);
                    }
                    break;

                case 'DRAGSELECT':
                    // ## TODO inplement update of selectedItems
                    break;
            }
        } else if (mouseButton === MouseButton.Middle || mouseButton === MouseButton.Right) {
            dispatch(translateCanvas([x - cursorPosition.x, y - cursorPosition.y]));
            dispatch(setCursorPosition([x, y]));
        }
    },

    mouseUp(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, canvasTransform, isWriting, hasCursorMoved } = getState().board;
        const { items, selectedItem, selectedPoint } = getState().items;
        const { selectedTool } = getState().tools;

        const [screenX, screenY] = [e.clientX, e.clientY];
        dispatch(setCursorPosition([screenX, screenY]));
        dispatch(setMouseButton());

        const [boardX, boardY] = getBoardCoordinates(screenX, screenY, canvasTransform);
        const clickedItem = Object.values(items).find((item) => isPointInsideItem(boardX, boardY, item));

        let editedItem: BoardItem | undefined = undefined;
        if (e.button === MouseButton.Left) {
            switch (currentAction) {
                case 'IDLE':
                    if (selectedTool === 'NOTE') {
                        createItem(screenX, screenY);
                    }
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
                    dispatch(setDraggedItem());
                    if (clickedItem) {
                        if (!hasCursorMoved) {
                            if (clickedItem !== selectedItem) dispatch(setSelectedItem(clickedItem));
                            else !isWriting && dispatch(setIsWriting(true));
                        }
                        dispatch(setCurrentAction('EDIT'));
                    } else dispatch(setCurrentAction('IDLE'));
                    break;

                case 'RESIZE':
                    editedItem = selectedItem;
                    if (selectedTool === 'NOTE' && selectedItem?.type === 'note') {
                        const { fillColor } = selectedItem;
                        const size = Math.abs(selectedItem.x2 - selectedItem.x0);
                        dispatch(setNoteStyle({ fillColor, size }));
                    } else if (selectedItem?.type === 'line' && isMainPoint(selectedPoint)) {
                        if (clickedItem) {
                            connectItem(clickedItem, selectedItem, selectedPoint, boardX, boardY);
                        } else disconnectItem(selectedItem, selectedPoint);
                    }
                    dispatch(setCurrentAction('EDIT'));
                    break;

                case 'DRAGSELECT':
                    if (clickedItem && !hasCursorMoved) {
                        dispatch(setSelectedItem(clickedItem));
                        dispatch(setCurrentAction('EDIT'));
                    } else {
                        // ## TODO check selectedItems
                        dispatch(setCurrentAction('IDLE'));
                        selectedItem && dispatch(setSelectedItem());
                        isWriting && dispatch(setIsWriting(false));
                    }
                    break;
            }
        } else if (e.button === MouseButton.Middle || e.button === MouseButton.Right) {
            if (currentAction === 'PAN') {
                if (selectedItem) dispatch(setCurrentAction('EDIT'));
                else dispatch(setCurrentAction('IDLE'));
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
