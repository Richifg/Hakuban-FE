import { Line } from '../interfaces';
import drawArrows from './drawArrows';

function drawLine(line: Line, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2, lineColor, lineWidth, lineType } = line;

    // line
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x0, y0);

    if (lineType === 'straight') {
        ctx.lineTo(x2, y2);
    } else {
        const width = x2 - x0;
        const height = y2 - y0;
        const horizontal = Math.abs(width) > Math.abs(height);
        const [midX, midY] = [(x2 + x0) / 2, (y2 + y0) / 2];
        if (lineType === 'stepped') {
            if (horizontal) {
                ctx.lineTo(midX, y0);
                ctx.lineTo(midX, y2);
            } else {
                ctx.lineTo(x0, midY);
                ctx.lineTo(x2, midY);
            }
            ctx.lineTo(x2, y2);
        } else if (lineType === 'curved') {
            const multiplier = 0.25;
            const [c1x, c1y] = horizontal ? [x0 + width * multiplier, y0] : [x0, y0 + height * multiplier];
            const [c2x, c2y] = horizontal ? [x2 - width * multiplier, y2] : [x2, y2 - height * multiplier];
            ctx.quadraticCurveTo(c1x, c1y, midX, midY);
            ctx.quadraticCurveTo(c2x, c2y, x2, y2);
        }
    }

    ctx.stroke();
    drawArrows(line, ctx);
}

export default drawLine;
