import React, { useRef } from 'react';
import { useDispatch, useSelector, useCanvas, useMovementFriction } from '../../../hooks';
import { setCurrentAction, translateCanvas } from '../../../store/slices/boardSlice';
import './CanvasItems.scss';

const CanvasItems = (): React.ReactElement => {
    const dispatch = useDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { items } = useSelector((s) => s.items);
    const { canvasSize, canvasTransform, lastTranslate, currentAction } = useSelector((s) => s.board);
    const { width, height } = canvasSize;

    // controls canvas camera movement
    useCanvas(canvasRef, canvasSize, canvasTransform, items);

    // continue sliding with friction after user pans the camera
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

export default CanvasItems;
