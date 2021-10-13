import React, { useState, useRef, useEffect } from 'react';
import useCanvasDraw from '../../common/hooks/useCanvasDraw';
import { Shape } from '../../common/interfaces/shapes';

import './Canvas.scss';

// TEMP, need to figure out canvas resizing
const WIDTH = 500;
const HEIGHT = 500;
const FRICTION_INTERVAL = 5; // in ms
const FRICTION = 0.9;

interface Canvas {
    shapes: Shape[];
}

const Canvas = ({ shapes }: Canvas): React.ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { drawShape, transform, clear } = useCanvasDraw(canvasRef, WIDTH, HEIGHT);
    const [isDragging, setIsDragging] = useState(false);
    const [isSliding, setIsSliding] = useState(false);
    const momentum = useRef({ x: 0, y: 0 });

    useEffect(() => {
        clear();
        shapes.forEach((shape) => drawShape(shape));
    }, [shapes]);

    useEffect(() => {
        let id: NodeJS.Timeout;
        if (isSliding) {
            id = setInterval(() => {
                const { x, y } = momentum.current;
                if (x !== 0 || y !== 0) {
                    clear();
                    transform(1, 0, 0, 1, x, y);
                    shapes.forEach((shape) => drawShape(shape));
                    momentum.current = {
                        x: Math.abs(x) > 0.1 ? FRICTION * x : 0,
                        y: Math.abs(y) > 0.1 ? FRICTION * y : 0,
                    };
                } else {
                    clearInterval(id);
                    setIsSliding(false);
                }
            }, FRICTION_INTERVAL);
        }
        return () => {
            clearInterval(id);
        };
    }, [isSliding]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (isDragging) {
            const [x, y] = [e.movementX, e.movementY];
            clear();
            transform(1, 0, 0, 1, x, y);
            shapes.forEach((shape) => drawShape(shape));
            momentum.current = { x, y };
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsSliding(true);
    };

    return (
        <canvas
            className="canvas"
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            onMouseMove={handleMouseMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
        >
            <p>This application requires the use of a canvas supporting browser</p>
        </canvas>
    );
};

export default Canvas;
