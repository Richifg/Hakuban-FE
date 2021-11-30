function getWrappedTextLines(text: string, maxWidth: number, ctx: CanvasRenderingContext2D): string[] {
    const wrappedLines: string[] = [];
    const textLines = text.split('/n');
    for (let i = 0; i < textLines.length; i++) {
        const text = textLines[i];
        let lastStart = 0;
        let currentWrappedLine = '';
        for (let j = 0; j < text.length; j++) {
            const char = text[j];
            if (ctx.measureText(text.slice(lastStart, j)).width <= maxWidth) {
                currentWrappedLine += char;
            } else {
                wrappedLines.push(currentWrappedLine);
                currentWrappedLine = char;
                lastStart = j;
            }
        }
        wrappedLines.push(currentWrappedLine);
    }
    return wrappedLines;
}

export default getWrappedTextLines;
