import { Drawing } from '../interfaces';
import { LINE_PATTERNS } from '../constants';

function drawDrawing(drawing: Drawing, ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();

    const { points, x0, y0, x2, y2 } = drawing;
    if (points.length > 1) {
        ctx.strokeStyle = drawing.lineColor;
        ctx.lineWidth = drawing.lineWidth;
        ctx.lineCap = 'round';
        ctx.setLineDash(LINE_PATTERNS[drawing.linePattern]);

        // new drawings have absolute coordinates up until they are finished
        if (drawing.isAbsolute) {
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
        } else {
            const [width, height] = [x2 - x0, y2 - y0];
            ctx.moveTo(points[0][0] * width + x0, points[0][1] * height + y0);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0] * width + x0, points[i][1] * height + y0);
            }
        }
    }
    ctx.stroke();
}

export default drawDrawing;
