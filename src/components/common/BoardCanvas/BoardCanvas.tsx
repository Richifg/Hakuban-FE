import React, { useRef } from 'react';
import { setCurrentAction, translateCanvas } from '../../../store/slices/boardSlice';
import { useCanvas, useDispatch, useSelector, useMovementFriction } from '../../../hooks';
import './BoardCanvas.scss';

const BoardCanvas = (): React.ReactElement => {
    const dispatch = useDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { items } = useSelector((s) => s.items);
    const { canvasSize, canvasTransform, lastTranslate, currentAction, showGrid } = useSelector((s) => s.board);
    const { width, height } = canvasSize;

    // renders items on every update
    useCanvas(canvasRef, canvasSize, canvasTransform, showGrid, items);

    // controls camera slide after user pans the camera
    // ##TODO maybe this shouldn't be in Canvas, or even in a component??
    useMovementFriction(
        lastTranslate,
        currentAction === 'SLIDE',
        (x: number, y: number) => dispatch(translateCanvas([x, y])),
        () => dispatch(setCurrentAction('IDLE')),
    );

    return (
        <canvas
            role="application"
            className="canvas"
            id="items"
            ref={canvasRef}
            width={width}
            height={height}
            onContextMenu={(e) => e.preventDefault()}
        >
            <p>This application requires the use of a canvas supporting browser</p>
        </canvas>
    );
};

export default BoardCanvas;