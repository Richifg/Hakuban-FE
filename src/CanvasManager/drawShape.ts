import { Shape } from '../interfaces';

function drawShape(shape: Shape, ctx: CanvasRenderingContext2D): void {
    const { shapeType } = shape;
    if (shapeType === 'rect') drawRect(shape, ctx);
    else if (shapeType === 'roundedRect') drawRoundedRect(shape, ctx);
    else if (shapeType === 'circle') drawCircle(shape, ctx);
    else if (shapeType === 'triangle') drawTriangle(shape, ctx);
    else if (shapeType === 'romboid') drawRomboid(shape, ctx);
    else drawBubble(shape, ctx);
}

function drawRect(shape: Shape, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2 } = shape;
    ctx.rect(x0, y0, x2 - x0, y2 - y0);
}

function drawRoundedRect(shape: Shape, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2 } = shape;
    const [fWidth, fHeight] = [(x2 - x0) * 0.1, (y2 - y0) * 0.1];
    const r = Math.min(Math.abs(fWidth), Math.abs(fHeight));
    ctx.moveTo(x2 - fWidth, y0);
    ctx.arcTo(x2, y0, x2, y0 + fHeight, r);
    ctx.lineTo(x2, y2 - fHeight);
    ctx.arcTo(x2, y2, x2 - fWidth, y2, r);
    ctx.lineTo(x0 + fWidth, y2);
    ctx.arcTo(x0, y2, x0, y2 - fHeight, r);
    ctx.lineTo(x0, y0 + fHeight);
    ctx.arcTo(x0, y0, x0 + fWidth, y0, r);
    ctx.closePath();
}

function drawCircle(shape: Shape, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2 } = shape;
    const [cX, cY] = [Math.floor((x0 + x2) * 0.5), Math.floor((y0 + y2) * 0.5)];
    const [rX, rY] = [Math.abs(x2 - cX), Math.abs(y2 - cY)];
    ctx.ellipse(cX, cY, rX, rY, 0, 0, Math.PI * 2);
}

function drawTriangle(shape: Shape, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2 } = shape;
    const halfWidth = (x2 - x0) * 0.5;
    ctx.moveTo(x0 + halfWidth, y0);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y2);
    ctx.closePath();
}
function drawRomboid(shape: Shape, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2 } = shape;
    const halfWidth = (x2 - x0) * 0.5;
    const halfHeight = (y2 - y0) * 0.5;
    ctx.moveTo(x0 + halfWidth, y0);
    ctx.lineTo(x2, y0 + halfHeight);
    ctx.lineTo(x0 + halfWidth, y2);
    ctx.lineTo(x0, y0 + halfHeight);
    ctx.closePath();
}

function drawBubble(shape: Shape, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2 } = shape;
    const [fWidth, fHeight] = [(x2 - x0) * 0.2, (y2 - y0) * 0.2];
    const r = Math.min(Math.abs(fWidth), Math.abs(fHeight));
    ctx.moveTo(x2 - fWidth, y0);
    ctx.arcTo(x2, y0, x2, y0 + fHeight, r);
    ctx.lineTo(x2, y2 - fHeight - fHeight);
    ctx.arcTo(x2, y2 - fHeight, x2 - fWidth, y2 - fHeight, r);
    ctx.lineTo(x0 + 2 * fWidth, y2 - fHeight);
    ctx.lineTo(x0 + fWidth, y2);
    ctx.lineTo(x0 + fWidth, y2 - fHeight);
    ctx.arcTo(x0, y2 - fHeight, x0, y2 - fHeight - fHeight, r);
    ctx.lineTo(x0, y0 + fHeight);
    ctx.arcTo(x0, y0, x0 + fWidth, y0, r);
    ctx.closePath();
}

export default drawShape;
