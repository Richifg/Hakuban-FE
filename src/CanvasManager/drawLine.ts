import { Line } from '../interfaces';

function drawLine(line: Line, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2, color, width } = line;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export default drawLine;
