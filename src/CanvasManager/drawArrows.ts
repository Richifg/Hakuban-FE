import { Line } from '../interfaces';

const ARROW_SIZE = 4; // px
const NINETY_DEG = Math.PI / 2;

function drawArrows(line: Line, ctx: CanvasRenderingContext2D): void {
    const { x0, x2, y0, y2, lineWidth, arrow0Type, arrow2Type, lineType } = line;
    // height of the triangle that forms the arrow
    const arrowHeight = ARROW_SIZE + (lineWidth - 1);

    let angle: number;
    let flipArrow: boolean;
    // straight lines required precise angled arrows
    if (lineType === 'straight') {
        angle = Math.atan((y2 - y0) / (x2 - x0));
        flipArrow = x0 > x2;
        // vertical tending lines have vertical arrows
    } else if (Math.abs(x2 - x0) < Math.abs(y2 - y0)) {
        angle = NINETY_DEG;
        flipArrow = y0 > y2;
    } else {
        // horizontal tending lines have horinzontal arrows
        angle = 0;
        flipArrow = x0 > x2;
    }

    (
        [
            [x0, y0, arrow0Type, flipArrow],
            [x2, y2, arrow2Type, !flipArrow],
        ] as const
    ).forEach(([x, y, arrowType, flip]) => {
        // arrows are drawn as if line is horizontal to avoid calculating angle proyections
        // additionally canvas is rotated to make arrow point where it should
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
    });
}

export default drawArrows;
