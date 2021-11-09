import React, { useRef } from 'react';
import { useSelector, useCanvas } from '../../../hooks';

const CanvasUserItems = (): React.ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { userItems } = useSelector((s) => s.items);
    const { canvasSize, canvasTransform } = useSelector((s) => s.board);
    const { width, height } = canvasSize;

    // controls canvas camera movement
    useCanvas(canvasRef, canvasSize, canvasTransform, userItems);

    return (
        <canvas
            role="application"
            className="canvas"
            id="user-items"
            ref={canvasRef}
            width={width}
            height={height}
            onContextMenu={(e) => e.preventDefault()}
        >
            <p>This application requires the use of a canvas supporting browser</p>
        </canvas>
    );
};

export default CanvasUserItems;
