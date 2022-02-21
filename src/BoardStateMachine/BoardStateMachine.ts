import { MouseEvent, WheelEvent } from 'react';
import { BoardItem, MouseButton } from '../interfaces';
import { store } from '../store/store';
import {
    setCurrentAction,
    setCursorPosition,
    setCanvasSize,
    translateCanvas,
    scaleCanvasToScreenPoint,
    setIsWriting,
    updateBoardLimits,
} from '../store/slices/boardSlice';
import { addUserItem, setSelectedItem, setSelectedPoint, setDragOffset } from '../store/slices/itemsSlice';
import { setNoteStyle } from '../store/slices/toolSlice';
import {
    getItemResizePoints,
    getItemTranslatePoints,
    isPointInsideItem,
    getNewNote,
    getNewShape,
    getNewDrawing,
    getDetransformedCoordinates,
    getFinishedDrawing,
} from '../utils';

const { dispatch, getState } = store;

/* 
    Board is at all times in one of many possible states (IDLE, PAN, DRAG, DRAW, etc)
    State machine does the following:
        - receives user inputs like mouse, wheel and window resize events
        - reads current state in addition to other variables from various store slices (e.g. selectedTool)
        - updates the new state
        - and also dispatches some actions like updating mouse position from events
*/

const BoardStateMachine = {
    mouseDown(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, canvasTransform } = getState().board;
        const { selectedItem, items, userItems } = getState().items;
        const { selectedTool } = getState().tools;
        const allItems = [...items, ...userItems];
        const [x, y] = [e.clientX, e.clientY];
        dispatch(setCursorPosition([x, y]));
        switch (currentAction) {
            case 'IDLE':
            case 'SLIDE':
                // middle mouse always takes priority
                if (e.button === MouseButton.Middle) {
                    dispatch(setCurrentAction('PAN'));
                } else if (selectedTool === 'POINTER') {
                    const item = allItems.find((item) => isPointInsideItem(x, y, item, canvasTransform));
                    if (item) {
                        // select clicked item
                        dispatch(setSelectedItem(item));
                        const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                        dispatch(setDragOffset([realX - item.x0, realY - item.y0]));
                        dispatch(setCurrentAction('DRAG'));
                        // pan because nothing was clicked
                    } else dispatch(setCurrentAction('PAN'));
                } else {
                    let newItem: BoardItem | undefined = undefined;
                    if (selectedTool === 'SHAPE') {
                        // create new Shape
                        const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                        newItem = getNewShape(realX, realY);
                        dispatch(setSelectedPoint('P2'));
                        dispatch(setCurrentAction('RESIZE'));
                    } else if (selectedTool === 'NOTE') {
                        // create new Note
                        const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                        newItem = getNewNote(realX, realY);
                        dispatch(setCurrentAction('IDLE'));
                    } else if (selectedTool === 'PEN') {
                        // create new Drawing
                        const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                        newItem = getNewDrawing(realX, realY);
                        dispatch(setCurrentAction('DRAW'));
                    }
                    if (newItem) {
                        dispatch(addUserItem(newItem));
                        dispatch(updateBoardLimits(newItem));
                    }
                }
                break;
            case 'EDIT':
                // ##TODO how to determine if a click was inside an element quickly?
                // also how about staking order of elementes
                const item = allItems.find((item) => isPointInsideItem(x, y, item, canvasTransform));
                if (item && selectedTool === 'POINTER') {
                    if (item.id !== selectedItem?.id) {
                        dispatch(setSelectedItem(item));
                        dispatch(setIsWriting(false));
                    } else dispatch(setIsWriting(true));
                    const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                    dispatch(setDragOffset([realX - item.x0, realY - item.y0]));
                    dispatch(setCurrentAction('DRAG'));
                } else {
                    dispatch(setIsWriting(false));
                    dispatch(setSelectedItem());
                    dispatch(setCurrentAction('PAN'));
                }
                break;
        }
    },

    mouseMove(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, cursorPosition, canvasTransform } = getState().board;
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
                    dispatch(addUserItem(updatedItem));
                    dispatch(updateBoardLimits(updatedItem));
                    dispatch(setIsWriting(false));
                }
                break;
            case 'RESIZE':
                if (selectedItem && selectedPoint) {
                    dispatch(setCursorPosition([x, y]));
                    const { type } = selectedItem;
                    const maintainRatio = type === 'note' || type === 'drawing';
                    const points = getItemResizePoints(selectedItem, selectedPoint, x, y, canvasTransform, maintainRatio);
                    const updatedItem = { ...selectedItem, ...points };
                    dispatch(addUserItem(updatedItem));
                    dispatch(updateBoardLimits(updatedItem));
                }
                break;
            case 'DRAW':
                if (selectedItem?.type === 'drawing') {
                    dispatch(setCursorPosition([x, y]));
                    const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                    const points = [...selectedItem.points, [realX, realY]] as [number, number][];
                    dispatch(addUserItem({ ...selectedItem, points }));
                }
        }
    },

    mouseUp(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction } = getState().board;
        dispatch(setCursorPosition([e.clientX, e.clientY]));
        const { selectedItem } = getState().items;
        switch (currentAction) {
            case 'PAN':
                dispatch(setCurrentAction('SLIDE'));
                break;
            case 'DRAG':
                dispatch(setCurrentAction('EDIT'));
                break;
            case 'RESIZE':
                dispatch(setCurrentAction('EDIT'));
                // update preferred Note size
                if (selectedItem?.type === 'note') {
                    const { color } = selectedItem;
                    const size = Math.abs(selectedItem.x2 - selectedItem.x0);
                    dispatch(setNoteStyle({ color, size }));
                }
                break;
            case 'DRAW':
                // transformed in progress drawing into relative coordinates drawing
                if (selectedItem?.type === 'drawing') {
                    const finishedDrawing = getFinishedDrawing(selectedItem);
                    dispatch(addUserItem(finishedDrawing));
                    dispatch(updateBoardLimits(finishedDrawing));
                }
                dispatch(setCurrentAction('IDLE'));
                break;
        }
    },

    mouseWheel(e: WheelEvent<HTMLDivElement>): void {
        const { canvasTransform, currentAction } = getState().board;
        if (currentAction !== 'IDLE') dispatch(setCurrentAction('IDLE'));
        const { scale } = canvasTransform;
        // calculate new scale, clamped between 4% and 400%
        const newScale = Math.min(Math.max(scale * (1 - Math.round(e.deltaY) * 0.001), 0.04), 4);
        dispatch(scaleCanvasToScreenPoint([newScale, e.clientX, e.clientY]));
    },

    windowResize(): void {
        dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
    },
};

export default BoardStateMachine;
