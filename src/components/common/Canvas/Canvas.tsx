import React, { useRef, useEffect } from 'react';
import { useSelector, useCanvas } from '../../../hooks';

import './Canvas.scss';

const Canvas = (): React.ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { drawItem, transform, clear } = useCanvas(canvasRef);
    const { items } = useSelector((s) => s.items);
    const { canvasSize, cursorMovement } = useSelector((s) => s.board);
    const { width, height } = canvasSize;

    useEffect(() => {
        clear(width, height);
        transform(1, 0, 0, 1, cursorMovement.x, cursorMovement.y);
        items.forEach((item) => drawItem(item));
    }, [cursorMovement]);

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
