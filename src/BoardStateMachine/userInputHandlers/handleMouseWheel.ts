import { WheelEvent } from 'react';
import { setCurrentAction, setCanvasScale, translateCanvas } from '../../store/slices/boardSlice';
import { getBoardCoordinates, getCanvasCoordinates } from '../../utils';

import { store } from '../../store/store';
const { dispatch, getState } = store;

function handleMouseWheel(e: WheelEvent<HTMLDivElement>): void {
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
}

export default handleMouseWheel;
