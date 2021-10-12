import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import './Canvas.scss';

const Canvas = (): React.ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    // capture the rendering context before first render
    useLayoutEffect(() => {
        const renderingContext = canvasRef.current?.getContext('2d');
        if (renderingContext) setCtx(renderingContext);
    }, []);

    // draw basic shape on first render
    useEffect(() => {
        if (ctx) {
            ctx.fillStyle = 'rgb(200, 0 , 0)';
            ctx.fillRect(10, 10, 50, 50);
            ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
            ctx.fillRect(30, 30, 50, 50);
        }
    });

    return (
        <canvas className="canvas" ref={canvasRef}>
            <p>This application requires the use of a canvas supporting browser</p>
        </canvas>
    );
};

export default Canvas;
