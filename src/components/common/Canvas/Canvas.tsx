import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import useCanvasDraw from '../../../hooks/useCanvasDraw';
import { useSelector } from '../../../hooks';

import './Canvas.scss';

const FRICTION_INTERVAL = 5; // in ms
const FRICTION = 0.9;

const Canvas = (): React.ReactElement => {
    const { items } = useSelector((s) => s.items);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const { drawShape, transform, clear } = useCanvasDraw(canvasRef, windowSize.width, windowSize.height);
    const [isSliding, setIsSliding] = useState(false);
    const isDragging = useRef(false);
    const momentum = useRef({ x: 0, y: 0 });

    // resize canvas with window
    useLayoutEffect(() => {
        const resizeHandler = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    useEffect(() => {
        clear();
        items.forEach((item) => drawShape(item));
    }, [items]);

    useEffect(() => {
        let id: NodeJS.Timeout;
        if (isSliding) {
            id = setInterval(() => {
                const { x, y } = momentum.current;
                if ((x !== 0 || y !== 0) && !isDragging.current) {
                    clear();
                    transform(1, 0, 0, 1, x, y);
                    items.forEach((item) => drawShape(item));
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

    const handleMouseDown = () => {
        isDragging.current = true;
    };
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (isDragging.current) {
            const [x, y] = [e.movementX, e.movementY];
            clear();
            transform(1, 0, 0, 1, x, y);
            items.forEach((item) => drawShape(item));
            momentum.current = { x, y };
        }
    };
    const handleMouseUp = () => {
        isDragging.current = false;
        setIsSliding(true);
    };

    return (
        <canvas
            className="canvas"
            ref={canvasRef}
            width={windowSize.width}
            height={windowSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
        >
            <p>This application requires the use of a canvas supporting browser</p>
        </canvas>
    );
};

export default Canvas;
