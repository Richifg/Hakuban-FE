import { WheelEvent } from 'react';
import { setCanvasScale, translateCanvas, setCurrentAction } from '../../store/slices/boardSlice';
import { getBoardCoordinates, getCanvasCoordinates } from '../../utils';

import { store } from '../../store/store';

function handleMouseWheel(e: WheelEvent<HTMLDivElement>): void {
    const { dispatch, getState } = store;
    const { canvasTransform, currentAction } = getState().board;
    const { scale } = canvasTransform;

    if (currentAction === 'SLIDE') dispatch(setCurrentAction('IDLE'));

    const zoomDelta = Math.abs(e.deltaY * 0.001);
    const zoomDirection = -1 * Math.sign(e.deltaY);

    let deltaModifier = 1;
    // changing zoom when zoomed out requires slower rate of zoom
    if (scale < 0.1) deltaModifier = 0.05;
    else if (scale < 0.25) deltaModifier = 0.2;
    else if (scale < 0.5) deltaModifier = 0.4;
    else if (scale < 0.75) deltaModifier = 0.8;
    // while changing zoom when zoomed in requires faster rate of zoom
    else if (scale > 3) deltaModifier = 2.5;
    else if (scale > 2) deltaModifier = 1.75;
    else if (scale > 1.75) deltaModifier = 1.5;
    else if (scale > 1.25) deltaModifier = 1.25;
    const unclampedScale = scale + zoomDelta * deltaModifier * zoomDirection;

    // calculate new scale, clamped between 2% and 500%
    let newScale = parseFloat(Math.min(Math.max(unclampedScale, 0.02), 5).toFixed(2));

    // when zoomed out, make sure to zoom at least 1% per scroll
    if (newScale === scale && scale < 1 && zoomDirection > 0) newScale += 0.01;

    dispatch(setCanvasScale(newScale));

    // get cursor board coordinates
    const [cursorX, cursorY] = [e.clientX, e.clientY];
    const [boardX, boardY] = getBoardCoordinates(cursorX, cursorY, canvasTransform);

    // position coordinates on canvas using the newScale
    const [newX, newY] = getCanvasCoordinates(boardX, boardY, { ...canvasTransform, scale: newScale });

    // translate so the cursor stays on same position on screen
    dispatch(translateCanvas([cursorX - newX, cursorY - newY]));
}

export default handleMouseWheel;
