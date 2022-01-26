import React, { useState, useMemo } from 'react';
import { getTransformedCoordinates } from '../../../utils';
import { useSelector } from '../../../hooks';

import './TextEditor.scss';

interface TextEditor {
    initText: string;
}

const TextEditor = ({ initText }: TextEditor): React.ReactElement => {
    const { canvasTransform, currentAction } = useSelector((s) => s.board);
    const { selectedItem } = useSelector((s) => s.items);
    const [text, setText] = useState(initText);

    const [x, y, w, h]: [x: number, y: number, w: number, h: number] = useMemo(() => {
        if (selectedItem) {
            const { x0, y0, x2, y2 } = selectedItem;
            const [x, y] = [Math.min(x0, x2), Math.min(y0, y2)];
            return [...getTransformedCoordinates(x, y, canvasTransform), Math.abs(x0 - x2), Math.abs(y0 - y2)];
        }
        return [0, 0, 0, 0];
    }, [canvasTransform, selectedItem]);

    const handleMouseDown = (e: React.MouseEvent) => e.stopPropagation();

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        // console.log(window.getSelection()?.toString().split('\n'));
    };

    const handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
        setText(e.currentTarget.innerHTML);
        // console.log(e.currentTarget.innerHTML);
        // console.log(e.currentTarget.innerText);
    };

    const { dX, dY, scale } = canvasTransform;
    if (!selectedItem || currentAction !== 'WRITE') return <div />;
    return (
        <div
            className="text-editor"
            style={{ width: w, height: h, transform: `translate(${dX}px, ${dY}px)  scale(${scale})` }}
            onMouseDown={handleMouseDown}
        >
            <div
                className="text"
                onMouseUp={handleMouseUp}
                contentEditable
                dangerouslySetInnerHTML={{ __html: text }}
                onInput={handleChange}
            />
        </div>
    );
};

TextEditor.defaultProps = {
    initText: '',
};

export default TextEditor;
