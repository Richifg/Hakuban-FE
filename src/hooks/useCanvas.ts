import React, { useState, useEffect, useLayoutEffect } from 'react';
import type { Circle, Rect, Item } from '../interfaces/items';
import type { CanvasTransform, CanvasSize } from '../interfaces/board';

interface useCanvasReturn {
    drawItem(item: Item): void;
    transform(transformObj: CanvasTransform): void;
    clear(): void;
    width: number;
    height: number;
}

const useCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    canvasSize: CanvasSize,
    canvasTransform: CanvasTransform,
    items: Item[],
): useCanvasReturn => {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const { width, height } = canvasSize;

    // capture the rendering context before first render
    useLayoutEffect(() => {
        const renderingContext = canvasRef.current?.getContext('2d');
        if (renderingContext) setCtx(renderingContext);
    }, []);

    const drawItem = (item: Item) => {
        if (ctx && item.type === 'shape') {
            ctx.save();
            if (item?.lineColor) ctx.strokeStyle = item.lineColor;
            if (item.shapeType === 'circle') drawCircle(item);
            if (item.shapeType === 'rect') drawRect(item);
            ctx.restore();
        }
    };

    const drawCircle = (circle: Circle) => {
        if (ctx) {
            const { x0, y0, x2, y2, fillColor } = circle;
            ctx.beginPath();
            const [cX, cY] = [Math.floor(x0 + x2 / 2), Math.floor(y0 + y2 / 2)];
            const [rX, rY] = [x2 - cX, y2 - cY];
            ctx.ellipse(cX, cY, rX, rY, 0, 0, Math.PI * 2);
            if (fillColor) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    };
    const drawRect = (rect: Rect) => {
        if (ctx) {
            const { x0, y0, x2, y2, fillColor } = rect;
            ctx.beginPath();
            ctx.rect(x0, y0, x2 - x0, y2 - y0);
            if (fillColor) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    };

    const transform = (transformObj: CanvasTransform) => {
        const { sX, sY, dX, dY } = transformObj;
        ctx?.setTransform(sX, 0, 0, sY, dX, dY);
    };

    const clear = () => {
        if (ctx) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, width, height);
            ctx.restore();
        }
    };

    // ##TODO maybe move this to a animationFrame thingy like the friction
    useEffect(() => {
        clear();
        transform(canvasTransform);
        items.forEach((item) => drawItem(item));
    }, [canvasTransform, items]);

    return {
        drawItem,
        transform,
        clear,
        width,
        height,
    };
};

export default useCanvas;
