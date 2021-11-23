import { MouseEvent, WheelEvent } from 'react';
import { store } from '../store/store';
import { setCurrentAction, setCursorPosition, setCanvasSize, translateCanvas, scaleCanvas } from '../store/slices/boardSlice';
import { addUserItem, setSelectedItem, setSelectedPoint, setDragOffset } from '../store/slices/itemsSlice';
import { getItemResizePoints, getItemTranslatePoints, isPointInsideItem } from '../utils';
import getDetransformedCoordinates from './getDetransformedCoordinates';

const { dispatch, getState } = store;

const BoardStateMachine = {
    mouseDown(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, selectedTool, canvasTransform } = getState().board;
        const { defaultItem, selectedItem, items, userItems } = getState().items;
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
                        dispatch(setCurrentAction('DRAG'));
                        const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                        dispatch(setDragOffset([realX - item.x0, realY - item.y0]));
                    } else {
                        dispatch(setCurrentAction('PAN'));
                    }
                }
                if (selectedTool === 'SHAPE') {
                    dispatch(setSelectedPoint('P2'));
                    const { dX, dY, scale } = canvasTransform;
                    // ##TODO add item id generation
                    const id = '123132';
                    const initX = (x - dX) / scale;
                    const initY = (y - dY) / scale;
                    const newItem = {
                        ...defaultItem,
                        id,
                        x0: initX,
                        y0: initY,
                        x2: initX,
                        y2: initY,
                    };
                    dispatch(addUserItem(newItem));
                    dispatch(setCurrentAction('RESIZE'));
                }
                break;
            case 'EDIT':
                // ##TODO how to determine if a click was inside an element quickly? cool algorithm shit
                // possibly RESIZE or DRAG depending on point clicked
                const item = allItems.find((item) => isPointInsideItem(x, y, item, canvasTransform));
                if (item) {
                    if (item.id !== selectedItem?.id) dispatch(setSelectedItem(item));
                    const [realX, realY] = getDetransformedCoordinates(x, y, canvasTransform);
                    dispatch(setDragOffset([realX - item.x0, realY - item.y0]));
                    dispatch(setCurrentAction('DRAG'));
                } else {
                    dispatch(setCurrentAction('PAN'));
                    dispatch(setSelectedItem());
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
        dispatch(setCursorPosition([x, y]));
        switch (currentAction) {
            // ##TODO possibly a case IDLE checking if mouseButton is clicked and transition to PAN
            case 'PAN':
                dispatch(translateCanvas([x - cursorPosition.x, y - cursorPosition.y]));
                break;
            case 'DRAG':
                if (selectedItem?.type === 'shape') {
                    const points = getItemTranslatePoints(selectedItem, dragOffset, x, y, canvasTransform);
                    dispatch(addUserItem({ ...selectedItem, ...points }));
                }
                break;
            case 'RESIZE':
                if (selectedItem?.type === 'shape' && selectedPoint) {
                    const points = getItemResizePoints(selectedItem, selectedPoint, x, y, canvasTransform);
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
        // ## TODO: turn mouse wheel sensitity into a constant. Also it should build up slightly
        const delta = -Math.round(e.deltaY) * 0.0005;
        dispatch(scaleCanvas(delta));
    },

    windowResize(): void {
        dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
    },
};

export default BoardStateMachine;
