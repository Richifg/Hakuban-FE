import React, { useState, useLayoutEffect } from 'react';
import { Shape, Circle, Rect } from '../interfaces/shapes';

interface useDrawShapeReturn {
    drawShape(shape: Shape): void;
    transform(sX: number, skY: number, skX: number, sY: number, dX: number, dY: number): void;
    clear(): void;
}

const useCanvasDraw = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    width: number,
    height: number,
): useDrawShapeReturn => {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    // capture the rendering context before first render
    useLayoutEffect(() => {
        const renderingContext = canvasRef.current?.getContext('2d');
        if (renderingContext) setCtx(renderingContext);
    }, []);

    const drawShape = (shape: Shape) => {
        if (ctx) {
            ctx.save();
            if (shape?.style?.strokeColor) ctx.strokeStyle = shape.style.strokeColor;
            if (shape.type === 'circle') drawCircle(shape);
            if (shape.type === 'rect') drawRect(shape);
            ctx.restore();
        }
    };

    const drawCircle = (circle: Circle) => {
        if (ctx) {
            const { cX, cY, rX, rY, style } = circle;
            ctx.beginPath();
            ctx.ellipse(cX, cY, rX, rY, 0, 0, Math.PI * 2);
            if (style?.backgroundColor) {
                ctx.fillStyle = style.backgroundColor;
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    };
    const drawRect = (rect: Rect) => {
        if (ctx) {
            const { x, y, width, height, style } = rect;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            if (style?.backgroundColor) {
                ctx.fillStyle = style.backgroundColor;
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    };

    const transform = (sX: number, skY: number, skX: number, sY: number, dX: number, dY: number) => {
        ctx?.transform(sX, skY, skX, sY, dX, dY);
    };

    const clear = () => {
        if (ctx) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, width, height);
            ctx.restore();
        }
    };

    return {
        drawShape,
        transform,
        clear,
    };
};

export default useCanvasDraw;
