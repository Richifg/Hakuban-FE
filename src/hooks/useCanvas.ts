import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Circle, Rect, Item } from '../interfaces/items';

type TransformArray = { sX: number; sY: number; dX: number; dY: number };
type CanvasSize = { width: number; height: number };

interface useCanvasReturn {
    drawItem(item: Item): void;
    transform(transformArray: TransformArray): void;
    clear(): void;
    width: number;
    height: number;
}

const useCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    canvasSize: CanvasSize,
    canvasTransform: TransformArray,
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
            if (item?.strokeColor) ctx.strokeStyle = item.strokeColor;
            if (item.shapeType === 'circle') drawCircle(item);
            if (item.shapeType === 'rect') drawRect(item);
            ctx.restore();
        }
    };

    const drawCircle = (circle: Circle) => {
        if (ctx) {
            const { cX, cY, rX, rY, backgroundColor } = circle;
            ctx.beginPath();
            ctx.ellipse(cX, cY, rX, rY, 0, 0, Math.PI * 2);
            if (backgroundColor) {
                ctx.fillStyle = backgroundColor;
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    };
    const drawRect = (rect: Rect) => {
        if (ctx) {
            const { x, y, width, height, backgroundColor } = rect;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            if (backgroundColor) {
                ctx.fillStyle = backgroundColor;
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    };

    const transform = (transformArray: TransformArray) => {
        const { sX, sY, dX, dY } = transformArray;
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
