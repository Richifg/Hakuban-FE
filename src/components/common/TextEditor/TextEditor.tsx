import React, { useState } from 'react';
import { useSelector } from '../../../hooks';

import './TextEditor.scss';

const TextEditor = (): React.ReactElement => {
    const { canvasTransform } = useSelector((s) => s.board);
    const [text, setText] = useState('asdas <b>asdsad</b>');

    const handleMouseDown = (e: React.MouseEvent) => e.stopPropagation();

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        // console.log(window.getSelection()?.toString().split('\n'));
    };

    const handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
        console.log(e.currentTarget.innerHTML);
        console.log(e.currentTarget.innerText);
    };

    const { scale, dX, dY } = canvasTransform;

    return (
        <div
            className="text-editor"
            style={{ transform: `translate(${dX}px, ${dY}px) scale(${scale})` }}
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

export default TextEditor;
