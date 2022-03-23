import { MouseEvent, WheelEvent } from 'react';
import { BoardItem, MouseButton } from '../interfaces';
import { store } from '../store/store';
import {
    setCurrentAction,
    setCursorPosition,
    setCanvasSize,
    translateCanvas,
    setCanvasScale,
    setIsWriting,
    setBoardLimits,
} from '../store/slices/boardSlice';
import { addItem, setSelectedItem, setSelectedPoint, setDragOffset } from '../store/slices/itemsSlice';
import { setNoteStyle } from '../store/slices/toolSlice';
import {
    getItemResizePoints,
    getItemTranslatePoints,
    isPointInsideItem,
    isMainPoint,
    getNewItem,
    getBoardCoordinates,
    getCanvasCoordinates,
    getFinishedDrawing,
    getUpdatedBoardLimits,
} from '../utils';
import updateLineConnections from './updateLineConnections';
import connectItem from './connectItem';
import disconnectItem from './disconnectItem';

const { dispatch, getState } = store;

/* 
    Board is at all times in one of many possible states (IDLE, PAN, DRAG, DRAW, etc)
    State machine does the following:
        - receives user inputs like mouse, wheel and window resize events
        - reads current state in addition to other variables from various store slices (e.g. selectedTool)
        - updates the new state
        - and also dispatches some actions like updating/creating items
*/

const BoardStateMachine = {
    mouseDown(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, canvasTransform, isWriting } = getState().board;
        const { selectedItem, items, lineConnections } = getState().items;
        const { selectedTool } = getState().tools;
        const itemsArray = Object.values(items);
        const [screenX, screenY] = [e.clientX, e.clientY];
        dispatch(setCursorPosition([screenX, screenY]));
        const [boardX, boardY] = getBoardCoordinates(screenX, screenY, canvasTransform);

        // check if an item was clicked
        let clickedItem: BoardItem | undefined = undefined;
        if (selectedTool === 'LINE' || selectedTool === 'POINTER') {
            clickedItem = itemsArray.find((item) => isPointInsideItem(screenX, screenY, item, canvasTransform));
        }

        switch (currentAction) {
            case 'IDLE':
            case 'SLIDE':
                // middle mouse always takes priority
                if (e.button === MouseButton.Middle) {
                    dispatch(setCurrentAction('PAN'));
                } else if (selectedTool === 'POINTER') {
                    if (clickedItem) {
                        // select clicked item
                        selectedItem?.id !== clickedItem.id && dispatch(setSelectedItem(clickedItem));
                        // drag item only if it isnt a connected line
                        if (clickedItem.type !== 'line' || !lineConnections[clickedItem.id]) {
                            dispatch(setDragOffset([boardX - clickedItem.x0, boardY - clickedItem.y0]));
                            dispatch(setCurrentAction('DRAG'));
                        } else {
                            dispatch(setCurrentAction('EDIT'));
                        }
                        // pan screen because nothing was clicked
                    } else dispatch(setCurrentAction('PAN'));
                } else {
                    let newItem: BoardItem | undefined = undefined;
                    if (selectedTool === 'SHAPE') {
                        newItem = getNewItem(boardX, boardY, 0, 'shape');
                        dispatch(setSelectedPoint('P2'));
                        dispatch(setCurrentAction('RESIZE'));
                    } else if (selectedTool === 'NOTE') {
                        newItem = getNewItem(boardX, boardY, 0, 'note');
                        dispatch(setCurrentAction('IDLE'));
                    } else if (selectedTool === 'PEN') {
                        newItem = getNewItem(boardX, boardY, 0, 'drawing');
                        dispatch(setCurrentAction('DRAW'));
                    } else if (selectedTool === 'LINE') {
                        newItem = getNewItem(boardX, boardY, 0, 'line');
                        dispatch(setSelectedPoint('P2'));
                        dispatch(setCurrentAction('RESIZE'));
                        if (clickedItem) connectItem(clickedItem, newItem, 'P0', boardX, boardY);
                    }
                    if (newItem) {
                        // add new item and update board limits
                        dispatch(addItem(newItem));
                        dispatch(setSelectedItem(newItem));
                        dispatch(setBoardLimits(getUpdatedBoardLimits(newItem)));
                    }
                }
                break;
            case 'EDIT':
                if (clickedItem) {
                    if (clickedItem.id !== selectedItem?.id) {
                        dispatch(setSelectedItem(clickedItem));
                        isWriting && dispatch(setIsWriting(false));
                    } else {
                        !isWriting && dispatch(setIsWriting(true));
                    }
                    if (clickedItem.type !== 'line' || !lineConnections[clickedItem.id]) {
                        dispatch(setDragOffset([boardX - clickedItem.x0, boardY - clickedItem.y0]));
                        dispatch(setCurrentAction('DRAG'));
                    }
                } else {
                    // nothing was selected
                    isWriting && dispatch(setIsWriting(false));
                    selectedItem && dispatch(setSelectedItem());
                    dispatch(setCurrentAction('PAN'));
                }
                break;
        }
    },

    mouseMove(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, cursorPosition, canvasTransform, isWriting } = getState().board;
        const { selectedItem, selectedPoint, dragOffset } = getState().items;
        const [x, y] = [e.clientX, e.clientY];
        switch (currentAction) {
            case 'PAN':
                dispatch(setCursorPosition([x, y]));
                dispatch(translateCanvas([x - cursorPosition.x, y - cursorPosition.y]));
                break;
            case 'DRAG':
                if (selectedItem) {
                    dispatch(setCursorPosition([x, y]));
                    const points = getItemTranslatePoints(selectedItem, dragOffset, x, y, canvasTransform);
                    const updatedItem = { ...selectedItem, ...points };
                    dispatch(addItem(updatedItem));
                    updateLineConnections(updatedItem);
                    isWriting && dispatch(setIsWriting(false));
                }
                break;
            case 'RESIZE':
                if (selectedItem && selectedPoint) {
                    dispatch(setCursorPosition([x, y]));
                    const { type } = selectedItem;
                    const maintainRatio = type === 'note' || type === 'drawing';
                    const points = getItemResizePoints(selectedItem, selectedPoint, x, y, canvasTransform, maintainRatio);
                    const updatedItem = { ...selectedItem, ...points };
                    dispatch(addItem(updatedItem));
                    updateLineConnections(updatedItem);
                }
                break;
            case 'DRAW':
                if (selectedItem?.type === 'drawing') {
                    dispatch(setCursorPosition([x, y]));
                    const [boardX, boardY] = getBoardCoordinates(x, y, canvasTransform);
                    const points = [...selectedItem.points, [boardX, boardY]] as [number, number][];
                    dispatch(addItem({ ...selectedItem, points }));
                }
        }
    },

    mouseUp(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, canvasTransform } = getState().board;
        const { selectedItem, selectedPoint, items } = getState().items;
        const [screenX, screenY] = [e.clientX, e.clientY];
        dispatch(setCursorPosition([screenX, screenY]));
        let editedItem: BoardItem | undefined = undefined;
        switch (currentAction) {
            case 'PAN':
                dispatch(setCurrentAction('SLIDE'));
                break;
            case 'DRAG':
                dispatch(setCurrentAction('EDIT'));
                editedItem = selectedItem;
                break;
            case 'RESIZE':
                dispatch(setCurrentAction('EDIT'));
                editedItem = selectedItem;
                // if resizing Note update preferred Note size
                if (selectedItem?.type === 'note') {
                    const { fillColor } = selectedItem;
                    const size = Math.abs(selectedItem.x2 - selectedItem.x0);
                    dispatch(setNoteStyle({ fillColor, size }));
                }
                // if resizing Line connect/disconnect line
                if (selectedItem?.type === 'line' && isMainPoint(selectedPoint)) {
                    const clickedItem = Object.values(items).find(
                        (item) => isPointInsideItem(screenX, screenY, item, canvasTransform) && item.id !== selectedItem.id,
                    );
                    if (clickedItem) {
                        const [boardX, boardY] = getBoardCoordinates(screenX, screenY, canvasTransform);
                        connectItem(clickedItem, selectedItem, selectedPoint, boardX, boardY);
                    } else {
                        disconnectItem(selectedItem, selectedPoint);
                    }
                }
                break;
            case 'DRAW':
                // transformed in progress drawing into relative coordinates drawing
                if (selectedItem?.type === 'drawing') {
                    const finishedDrawing = getFinishedDrawing(selectedItem);
                    dispatch(addItem(finishedDrawing));
                    dispatch(setBoardLimits(getUpdatedBoardLimits(finishedDrawing)));
                    editedItem = finishedDrawing;
                }
                dispatch(setCurrentAction('IDLE'));
                break;
        }
        if (editedItem) {
            dispatch(setBoardLimits(getUpdatedBoardLimits(editedItem)));
        }
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
