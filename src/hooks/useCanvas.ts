import React, { useState, useEffect, useLayoutEffect } from 'react';
import type { Circle, Rect, Item, Text } from '../interfaces/items';
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
        if (ctx) {
            ctx.save();
            if (item.type === 'shape') {
                if (item?.lineColor) ctx.strokeStyle = item.lineColor;
                if (item.shapeType === 'circle') drawCircle(item);
                if (item.shapeType === 'rect') drawRect(item);
            } else if (item.type === 'text') {
                drawText(item);
            }
            ctx.restore();
        }
    };

    const drawCircle = (circle: Circle) => {
        if (ctx) {
            const { x0, y0, x2, y2, fillColor } = circle;
            ctx.beginPath();
            const [cX, cY] = [Math.floor((x0 + x2) / 2), Math.floor((y0 + y2) / 2)];
            const [rX, rY] = [Math.abs(x2 - cX), Math.abs(y2 - cY)];
            ctx.ellipse(cX, cY, rX, rY, 0, 0, Math.PI * 2);
            if (fillColor) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.stroke();
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
            }
            ctx.stroke();
        }
    };

    const drawText = (text: Text) => {
        if (ctx) {
            const { content, x0, y0, x2, y2, fontSize, fontFamily, hAlign, vAlign } = text;
            if (fontSize && fontFamily) ctx.font = `${fontSize}px ${fontFamily}`;
            if (hAlign) ctx.textAlign = hAlign;
            // clipping region for rendering text
            ctx.beginPath();
            ctx.rect(x0, y0, x2 - x0, y2 - y0);
            ctx.clip();
            // text alignment
            let x: number;
            if (hAlign === 'start') x = Math.min(x0, x2);
            else if (hAlign === 'end') x = Math.max(x0, x2);
            else x = (x0 + x2) / 2;
            ctx.fillText(content, x, Math.max(y0, y2));
        }
    };

    const transform = (transformObj: CanvasTransform) => {
        const { scale, dX, dY } = transformObj;
        ctx?.setTransform(scale, 0, 0, scale, dX, dY);
    };

    const clear = () => {
        ctx?.save();
        ctx?.setTransform(1, 0, 0, 1, 0, 0);
        ctx?.clearRect(0, 0, width, height);
        ctx?.restore();
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
