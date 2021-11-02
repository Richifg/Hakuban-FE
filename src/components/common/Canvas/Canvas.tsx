import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector, useCanvas, useMovementFriction } from '../../../hooks';
import { setCurrentAction, translateCanvas } from '../../../store/slices/boardSlice';
import './Canvas.scss';

const Canvas = (): React.ReactElement => {
    const dispatch = useDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { drawItem, transform, clear } = useCanvas(canvasRef);
    const { items } = useSelector((s) => s.items);
    const { canvasSize, canvasTransform, lastTranslate, currentAction } = useSelector((s) => s.board);
    const { width, height } = canvasSize;

    // continue sliding with friction after user pans the camera
    useMovementFriction(
        lastTranslate,
        currentAction === 'SLIDE',
        (x: number, y: number) => dispatch(translateCanvas([x, y])),
        () => dispatch(setCurrentAction('IDLE')),
    );

    // update canvas transform and repaint items
    useEffect(() => {
        clear(width, height);
        transform(canvasTransform);
        items.forEach((item) => drawItem(item));
    }, [canvasTransform]);

    return (
        <canvas
            role="application"
            className="canvas"
            ref={canvasRef}
            width={width}
            height={height}
            onContextMenu={(e) => e.preventDefault()}
        >
            <p>This application requires the use of a canvas supporting browser</p>
        </canvas>
    );
};

export default Canvas;
