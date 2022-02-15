import { MouseEvent, WheelEvent } from 'react';
import { store } from '../store/store';
import {
    setCurrentAction,
    setCursorPosition,
    setCanvasSize,
    translateCanvas,
    scaleCanvasTo,
    setIsWriting,
} from '../store/slices/boardSlice';
import { addUserItem, setSelectedItem, setSelectedPoint, setDragOffset } from '../store/slices/itemsSlice';
import {
    getItemResizePoints,
    getItemTranslatePoints,
    isPointInsideItem,
    getNewNote,
    getNewShape,
    getDetransformedCoordinates,
    getTransformedCoordinates,
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
        const { selectedTool, shapeStyle, shapeType } = getState().tools;
        const allItems = [...items, ...userItems];
        const [x, y] = [e.clientX, e.clientY];
        dispatch(setCursorPosition([x, y]));
        switch (currentAction) {
            case 'IDLE':
            case 'SLIDE':
                if (selectedTool === 'POINTER') {
                    const item = allItems.find((item) => isPointInsideItem(x, y, item, canvasTransform));
                    if (item) {
                        dispatch(setSelectedItem(item));
                        const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                        dispatch(setDragOffset([realX - item.x0, realY - item.y0]));
                        dispatch(setCurrentAction('DRAG'));
                    } else {
                        dispatch(setCurrentAction('PAN'));
                    }
                } else if (selectedTool === 'SHAPE') {
                    const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                    const shape = getNewShape(realX, realY, shapeType, shapeStyle);
                    dispatch(addUserItem(shape));
                    dispatch(setSelectedPoint('P2'));
                    dispatch(setCurrentAction('RESIZE'));
                } else if (selectedTool === 'NOTE') {
                    const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                    const note = getNewNote(realX, realY);
                    dispatch(addUserItem(note));
                    dispatch(setCurrentAction('IDLE'));
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
            default:
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
                    dispatch(addUserItem({ ...selectedItem, ...points }));
                    dispatch(setIsWriting(false));
                }
                break;
            case 'RESIZE':
                if (selectedItem && selectedPoint) {
                    dispatch(setCursorPosition([x, y]));
                    const maintainRatio = selectedItem.type === 'note';
                    const points = getItemResizePoints(selectedItem, selectedPoint, x, y, canvasTransform, maintainRatio);
                    dispatch(addUserItem({ ...selectedItem, ...points }));
                }
                break;
        }
    },

    mouseUp(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction } = getState().board;
        dispatch(setCursorPosition([e.clientX, e.clientY]));
        switch (currentAction) {
            case 'PAN':
                dispatch(setCurrentAction('SLIDE'));
                break;
            case 'DRAG':
                dispatch(setCurrentAction('EDIT'));
                break;
            case 'RESIZE':
                dispatch(setCurrentAction('EDIT'));
                break;
            default:
                break;
        }
    },

    mouseWheel(e: WheelEvent<HTMLDivElement>): void {
        const { canvasTransform, currentAction } = getState().board;
        if (currentAction === 'IDLE') dispatch(setCurrentAction('IDLE'));
        // calculate new scale
        const delta = -Math.round(e.deltaY) * 0.0005;
        const scale = canvasTransform.scale + delta;
        // translate canvas so cursor remains in the same relative position
        const [x, y] = [e.clientX, e.clientY];
        const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
        const [newX, newY] = getTransformedCoordinates(realX, realY, { ...canvasTransform, scale });
        const [dX, dY] = [x - newX, y - newY];
        dispatch(scaleCanvasTo(scale));
        dispatch(translateCanvas([dX, dY]));
    },

    windowResize(): void {
        dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
    },
};

export default BoardStateMachine;
