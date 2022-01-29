import React, { useState, useMemo, useEffect } from 'react';
import { getTransformedCoordinates } from '../../../utils';
import { useSelector } from '../../../hooks';
import { Align } from '../../../interfaces';

import './TextEditor.scss';

// TODO: add style from item to texteditor (more css)

const TextEditor = (): React.ReactElement => {
    const { canvasTransform, currentAction } = useSelector((s) => s.board);
    const { textStyle } = useSelector((s) => s.tools);
    const { selectedItem } = useSelector((s) => s.items);
    const [text, setText] = useState('');

    useEffect(() => {
        const text = selectedItem?.text?.content || '';
        setText(text);
    }, [selectedItem]);

    const [color, font, textAlign, verticalAlign]: [string, string, Align, string] = useMemo(() => {
        const source = selectedItem?.text || textStyle;
        console.log('bew source', source);
        const { color, fontSize, fontFamily, hAlign, vAlign, bold } = source;
        const verticalAlign = vAlign == 'start' ? ' top' : vAlign == 'end' ? 'bottom' : 'middle';
        const font = `${bold ? 'bold' : 'normal'} ${fontSize}px ${fontFamily}`;
        return [color, font, hAlign, verticalAlign];
    }, [selectedItem, textStyle]);

    const [left, top, width, height]: [number, number, number, number] = useMemo(() => {
        if (selectedItem) {
            const { x0, y0, x2, y2 } = selectedItem;
            const [x, y] = [Math.min(x0, x2), Math.min(y0, y2)];
            return [...getTransformedCoordinates(x, y, canvasTransform), Math.abs(x0 - x2), Math.abs(y0 - y2)];
        }
        return [0, 0, 0, 0];
    }, [selectedItem, canvasTransform]);

    const handleMouseDown = (e: React.MouseEvent) => e.stopPropagation();

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        // console.log(window.getSelection()?.toString().split('\n'));
    };

    const handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
        // setText(e.currentTarget.innerHTML);
        // console.log(e.currentTarget.innerText);
    };

    const { scale } = canvasTransform;
    if (!selectedItem || currentAction !== 'WRITE') return <div />;
    return (
        <div
            className="text-editor"
            style={{ left, top, width, height, transform: `scale(${scale})` }}
            onMouseDown={handleMouseDown}
        >
            <div
                className="text"
                style={{ color, font, textAlign, verticalAlign, width }}
                onMouseUp={handleMouseUp}
                contentEditable
                dangerouslySetInnerHTML={{ __html: text }}
                onInput={handleChange}
            />
        </div>
    );
};

export default TextEditor;
