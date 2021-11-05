import { MouseEvent } from 'react';
import { store } from '../store/store';
import { setCurrentAction, setCursorPosition, setCanvasSize, translateCanvas } from '../store/slices/boardSlice';

const { dispatch, getState } = store;

const BoardStateMachine = {
    mouseDown(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, selectedTool } = getState().board;
        if (currentAction === 'IDLE' && selectedTool === 'POINTER') dispatch(setCurrentAction('PAN'));
        if (currentAction === 'SLIDE') dispatch(setCurrentAction('PAN'));
    },
    mouseUp(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction } = getState().board;
        if (currentAction === 'PAN') dispatch(setCurrentAction('SLIDE'));
    },
    mouseMove(e: MouseEvent<HTMLDivElement>): void {
        const { currentAction, cursorPosition } = getState().board;
        dispatch(setCursorPosition([e.clientX, e.clientY]));
        if (currentAction === 'PAN') {
            dispatch(translateCanvas([e.clientX - cursorPosition.x, e.clientY - cursorPosition.y]));
        }
    },
    windowResize(): void {
        dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
    },
};

export default BoardStateMachine;
