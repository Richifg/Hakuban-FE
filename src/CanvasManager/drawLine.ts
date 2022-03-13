import { Line } from '../interfaces';

const ARROW_SIZE = 4;

function drawLine(line: Line, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2, lineColor, lineWidth, arrow0Style, arrow2Style } = line;

    // line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // arrow calculations
    const height = y2 - y0;
    const width = x2 - x0;
    const angle = Math.atan(height / width);
    const arrowHalfBase = ARROW_SIZE * 0.5 + (lineWidth - 1) * 0.5;
    const arrowHeight = ARROW_SIZE + (lineWidth - 1);

    // arrows are drawn as if line is horizontal to avoid calculating proyections
    // canvas is rotated to make arrow point where it should
    if (arrow0Style !== 'none') {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x0, y0);
        ctx.rotate(angle);
        ctx.moveTo(0, 0);
        ctx.lineTo(arrowHeight, arrowHalfBase);
        ctx.lineTo(arrowHeight, -arrowHalfBase);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    if (arrow2Style !== 'none') {
        ctx.beginPath();
        ctx.translate(x2, y2);
        ctx.rotate(angle);
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowHeight, arrowHalfBase);
        ctx.lineTo(-arrowHeight, -arrowHalfBase);
        ctx.closePath();
        ctx.stroke();
    }
}

export default drawLine;
