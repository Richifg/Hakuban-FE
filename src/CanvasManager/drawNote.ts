import { Note } from '../interfaces';

function drawNote(note: Note, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2, fillColor } = note;
    const size = Math.abs(x2 - x0);

    // note body shadow
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = size * 0.04;

    // sticky note
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x2, y0);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y2);
    ctx.closePath();
    ctx.fill();

    // glue part shadow
    ctx.beginPath();
    const glueHeight = 0.2 * size;
    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.moveTo(x0, y0);
    ctx.lineTo(x2, y0);
    ctx.lineTo(x2, y0 + glueHeight);
    ctx.lineTo(x0, y0 + glueHeight);
    ctx.closePath();
    ctx.fill();

    // remove shadows so text doens't have any (text is drawn next)
    ctx.shadowColor = 'transparent';
}

export default drawNote;
