import type { Circle, Rect, Item, Text } from '../interfaces/items';
import type { CanvasTransform, CanvasSize } from '../interfaces/board';

/*
    Manages the animation cycle of a canvas html element, by constantly
     - clearing screen
     - transforming canvas (scale, translate)
     - and drawing items on screen
    Uses animationFrames to make it look smooth 
*/

class CanvasManager {
    private ctx: CanvasRenderingContext2D;
    size: CanvasSize;
    transform: CanvasTransform;
    items: Item[];
    animationId?: number;

    constructor(ctx: CanvasRenderingContext2D, size: CanvasSize, transform: CanvasTransform, items: Item[]) {
        this.ctx = ctx;
        this.size = size;
        this.transform = transform;
        this.items = items;
    }

    drawItem(item: Item): void {
        this.ctx.save();
        if (item.type === 'shape') {
            this.ctx.strokeStyle = item.lineColor;
            this.ctx.fillStyle = item.fillColor;
            this.ctx.lineWidth = item.lineWidth;
            if (item.shapeType === 'circle') this.drawCircle(item);
            if (item.shapeType === 'rect') this.drawRect(item);
        } else if (item.type === 'text') {
            this.drawText(item);
        }
        this.ctx.restore();
    }

    drawCircle(circle: Circle): void {
        const { x0, y0, x2, y2 } = circle;
        this.ctx.beginPath();
        const [cX, cY] = [Math.floor((x0 + x2) / 2), Math.floor((y0 + y2) / 2)];
        const [rX, rY] = [Math.abs(x2 - cX), Math.abs(y2 - cY)];
        this.ctx.ellipse(cX, cY, rX, rY, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawRect(rect: Rect): void {
        const { x0, y0, x2, y2 } = rect;
        this.ctx.beginPath();
        this.ctx.rect(x0, y0, x2 - x0, y2 - y0);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawText(text: Text): void {
        const { content, x0, y0, x2, y2, fontSize, fontFamily, hAlign, vAlign } = text;
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.textAlign = hAlign;
        // clipping region for rendering text
        this.ctx.beginPath();
        this.ctx.rect(x0, y0, x2 - x0, y2 - y0);
        this.ctx.clip();
        // text alignment
        let x: number;
        if (hAlign === 'start') x = Math.min(x0, x2);
        else if (hAlign === 'end') x = Math.max(x0, x2);
        else x = (x0 + x2) / 2;
        this.ctx.fillText(content, x, Math.max(y0, y2));
    }

    transformCanvas(): void {
        const { scale, dX, dY } = this.transform;
        this.ctx.setTransform(scale, 0, 0, scale, dX, dY);
    }

    clear(): void {
        const { width, height } = this.size;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.restore();
    }

    animate(): void {
        this.clear();
        this.transformCanvas();
        this.items.forEach((item) => this.drawItem(item));
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    stop(): void {
        this.animationId && cancelAnimationFrame(this.animationId);
    }
}

export default CanvasManager;
