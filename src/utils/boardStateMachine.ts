import { MouseEvent } from 'react';
import { store } from '../store/store';
import { setCurrentAction, setCursorPosition, setCanvasSize, translateCanvas } from '../store/slices/boardSlice';
import { addUserItem, setSelectedItem, setSelectedPoint } from '../store/slices/itemsSlice';
import { getItemResizePoints, getItemTranslatePoints } from '../utils';

const { dispatch, getState } = store;

const BoardStateMachine = {
    mouseDown(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, selectedTool } = getState().board;
        const { defaultItem } = getState().items;
        const [x, y] = [e.clientX, e.clientY];
        dispatch(setCursorPosition([x, y]));
        switch (currentAction) {
            case 'IDLE':
            case 'SLIDE':
                if (selectedTool === 'POINTER') dispatch(setCurrentAction('PAN'));
                if (selectedTool === 'SHAPE') {
                    dispatch(setSelectedPoint('P2'));
                    const id = '123132';
                    const newItem = { ...defaultItem, id, x0: x, y0: y, x2: x, y2: y };
                    dispatch(addUserItem(newItem));
                    dispatch(setSelectedItem(newItem));
                    dispatch(setCurrentAction('RESIZE'));
                }
                break;
            case 'EDIT':
                // ##TODO how to determine if a click was inside an element quickly? cool algorithm shit
                // possibly RESIZE or DRAG depending on point clicked
                // possibly IDLE if click on empty space
                // possible change edit item id and stay EDIT
                dispatch(setCurrentAction('IDLE'));
                break;
            default:
                break;
        }
    },

    mouseMove(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, cursorPosition, canvasTransform } = getState().board;
        const { selectedItem, selectedPoint } = getState().items;
        const [x, y] = [e.clientX, e.clientY];
        dispatch(setCursorPosition([x, y]));
        switch (currentAction) {
            case 'PAN':
                dispatch(translateCanvas([x - cursorPosition.x, y - cursorPosition.y]));
                break;
            case 'DRAG':
                if (selectedItem?.type === 'shape' && selectedPoint) {
                    const { x0, y0, x2, y2 } = getItemTranslatePoints(selectedItem, selectedPoint, x, y, canvasTransform);
                    dispatch(addUserItem({ ...selectedItem, x0, y0, x2, y2 }));
                }
                break;
            case 'RESIZE':
                if (selectedItem?.type === 'shape' && selectedPoint) {
                    const { x0, y0, x2, y2 } = getItemResizePoints(selectedItem, selectedPoint, x, y, canvasTransform);
                    dispatch(addUserItem({ ...selectedItem, x0, y0, x2, y2 }));
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
                // possible update posistion again maybe?? see mouseMouseMove
                dispatch(setCurrentAction('EDIT'));
                break;
            case 'RESIZE':
                // possibly update position 1 last time mouseMouseMove
                dispatch(setCurrentAction('EDIT'));
                break;
            default:
                break;
        }
    },
    windowResize(): void {
        dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
    },
};

export default BoardStateMachine;
