import { Line, ArrowType } from '../interfaces';

const ARROW_SIZE = 4;

function drawLine(line: Line, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2, lineColor, lineWidth, arrow0Type, arrow2Type } = line;

    // line
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // arrow calculations
    const angle = Math.atan((y2 - y0) / (x2 - x0));
    const arrowHeight = ARROW_SIZE + (lineWidth - 1);

    const flipArrow = x2 < x0;
    drawArrow(arrow0Type, x0, y0, angle, arrowHeight, ctx, flipArrow);
    drawArrow(arrow2Type, x2, y2, angle, arrowHeight, ctx, !flipArrow);
}

function drawArrow(
    arrowType: ArrowType,
    x: number,
    y: number,
    angle: number,
    arrowHeight: number,
    ctx: CanvasRenderingContext2D,
    flip = false,
) {
    // arrows are drawn as if line is horizontal to avoid calculating proyections
    // canvas is rotated to make arrow point where it should
    const height = flip ? -arrowHeight : arrowHeight;

    if (arrowType !== 'none') {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.moveTo(0, 0);
        if (arrowType === 'simple') {
            ctx.moveTo(height, height);
            ctx.lineTo(0, 0);
            ctx.lineTo(height, -height);
            ctx.lineTo(0, 0);
        } else if (arrowType === 'triangle') {
            const base = height * 0.5;
            ctx.lineTo(height, base);
            ctx.lineTo(height, -base);
            ctx.closePath();
        } else if (arrowType === 'circle') {
            const base = arrowHeight * 0.5;
            ctx.ellipse(0, 0, base, base, 0, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}

export default drawLine;
