import { TextData, Coordinates } from '../interfaces';
import { getWrappedTextLines } from '../utils';

const LINE_HEIGHT = 1.1; // em

function drawText(text: TextData, coordinates: Coordinates, ctx: CanvasRenderingContext2D): void {
    if (text.skipRendering) return;

    const { content, textColor, fontFamily, fontSize, vAlign, hAlign, bold, italic } = text;
    const { x0, y0, x2, y2 } = coordinates;
    // initial settings
    ctx.font = `${italic ? 'italic' : 'normal'} ${bold ? 'bold' : 'normal'} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = hAlign;
    ctx.textBaseline = 'top';
    const [maxWidth, maxHeight] = [Math.abs(x2 - x0), Math.abs(y2 - y0)];
    const [minX, minY] = [Math.min(x0, x2), Math.min(y0, y2)];

    // cut text into wrapped lines
    const textLines = getWrappedTextLines(content, maxWidth, ctx);
    const lineHeight = fontSize * LINE_HEIGHT;
    const fullTextHeight = lineHeight * textLines.length;

    // clipping region for rendering text
    ctx.beginPath();
    ctx.rect(minX, minY, maxWidth, maxHeight);
    ctx.clip();

    // calculate x position for all lines of text
    let x: number;
    if (hAlign === 'start') x = minX;
    else if (hAlign === 'end') x = Math.max(x0, x2);
    else x = minX + maxWidth / 2;

    // calculate y position for the first line of text
    let y: number;
    if (vAlign === 'start') y = minY;
    else if (vAlign === 'end') y = Math.max(y0, y2) - fullTextHeight;
    else y = minY + (maxHeight - fullTextHeight) / 2;

    // draw each line
    textLines.forEach((text) => {
        ctx.fillText(text, x, y);
        y += lineHeight;
    });
}

export default drawText;
