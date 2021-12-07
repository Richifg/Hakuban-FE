// receives a text string and breaks it into wrapping lines that do not exceed the maxWidth
// ctx holds the settings (size, font) of the text to calculate size

function getWrappedTextLines(text: string, maxWidth: number, ctx: CanvasRenderingContext2D): string[] {
    const wrappedLines: string[] = [];
    const textLines = text.split('/n');
    // for every line of text
    for (let i = 0; i < textLines.length; i++) {
        const words = textLines[i].split(' ');
        let currentWrappedLine = '';
        while (words.length) {
            const word = words.shift() as string;
            const space = currentWrappedLine ? ' ' : '';
            // add word if it fits whole
            if (ctx.measureText(currentWrappedLine + space + word).width <= maxWidth) {
                currentWrappedLine += space + word;
            } else if (currentWrappedLine === '') {
                // if its the first word of the line, add as many letters as possible
                for (let k = 0; k < word.length; k++) {
                    const char = word[k];
                    // first letter should always be added even if it doesn't fit
                    if (k === 0 || ctx.measureText(currentWrappedLine + char).width <= maxWidth) {
                        currentWrappedLine += char;
                    } else {
                        // finish line and make a new word with remaining letters
                        wrappedLines.push(currentWrappedLine);
                        currentWrappedLine = '';
                        words.unshift(word.slice(k));
                        break;
                    }
                }
            } else {
                // finish line and keep word for next line
                wrappedLines.push(currentWrappedLine);
                currentWrappedLine = '';
                words.unshift(word);
            }
        }
        wrappedLines.push(currentWrappedLine);
    }
    return wrappedLines;
}

export default getWrappedTextLines;
