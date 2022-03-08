import React, { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { getItemPositionCSSVars, getTextAreaCoordinates, isTextItem } from '../../../utils';
import { useSelector, useDispatch, useDebouncedCallback } from '../../../hooks';
import { addItem } from '../../../store/slices/itemsSlice';
import { Align, BoardItem } from '../../../interfaces';

import './TextEditor.scss';

const TextEditor = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { canvasTransform, isWriting } = useSelector((s) => s.board);
    const { textStyle } = useSelector((s) => s.tools);
    const { selectedItem } = useSelector((s) => s.items);
    const [initText, setInitText] = useState('');
    const textBoxRef = useRef<HTMLDivElement>(null);

    // keep last selected item on ref so it can be used inside debounce callback below
    const lastSelectedItemRef = useRef<BoardItem>();

    // updates initial display text when selected item id changes
    useLayoutEffect(() => {
        if (selectedItem && 'text' in selectedItem) {
            const text = selectedItem?.text?.content || '';
            const htmlText = text.replaceAll(/\/n/g, '<br/>');
            setInitText(htmlText);
        } else {
            setInitText('');
        }
    }, [selectedItem?.id]);

    // update skip rendering so canvas doenst double render text of edited item
    useEffect(() => {
        // if selected item had text, it needs to be skipped
        if (isWriting && isTextItem(selectedItem) && selectedItem.text) {
            dispatch(addItem({ ...selectedItem, text: { ...selectedItem.text, skipRendering: true } }));
        }
        const lastItem = lastSelectedItemRef.current;
        if (!isWriting && isTextItem(lastItem) && lastItem.text) {
            dispatch(addItem({ ...lastItem, text: { ...lastItem.text, skipRendering: false } }));
        }
    }, [isWriting]);

    // keeps track of last selectedItem with every change of item
    useEffect(() => {
        lastSelectedItemRef.current = selectedItem;
    }, [selectedItem]);

    // handles update of item's text
    const handleTextChange = useDebouncedCallback((e: React.ChangeEvent<HTMLDivElement>) => {
        const text = e.target.innerHTML;
        const lastItem = lastSelectedItemRef.current;
        if (!isWriting && isTextItem(lastItem)) {
            // clean html from textbox
            const content = text.replace(/\<br\/?\>/g, '/n').replace(/\&nbsp;/g, ' ');
            let newItem: BoardItem;
            // add new text content to item
            const skipRendering = true;
            if (lastItem.text) newItem = { ...lastItem, text: { ...lastItem.text, content, skipRendering } };
            else newItem = { ...lastItem, text: { ...textStyle, content, skipRendering } };
            dispatch(addItem(newItem));
        }
    }, 150);

    // css style vars for texteditor
    const [color, font, textAlign, verticalAlign]: [string, string, Align, string] = useMemo(() => {
        const source = (isTextItem(selectedItem) && selectedItem?.text) || textStyle;
        const { color, fontSize, fontFamily, hAlign, vAlign, bold, italic } = source;
        const verticalAlign = vAlign == 'start' ? ' top' : vAlign == 'end' ? 'bottom' : 'middle';
        const font = `${italic ? 'italic' : 'normal'} ${bold ? 'bold' : 'normal'} ${fontSize}px ${fontFamily}`;
        return [color, font, hAlign, verticalAlign];
    }, [selectedItem, textStyle]);

    // css position vars for texteditor
    const { left, top, width, height } = useMemo(() => {
        if (!selectedItem) return { left: 0, top: 0, width: 0, height: 0 };
        const { type } = selectedItem;
        if (type === 'shape' || type === 'note') {
            const coordinates = getTextAreaCoordinates(selectedItem);
            return getItemPositionCSSVars(canvasTransform, coordinates);
        } else {
            const { x0, y0, x2, y2 } = selectedItem;
            return getItemPositionCSSVars(canvasTransform, { x0, y0, x2, y2 });
        }
    }, [canvasTransform, selectedItem]);

    // ##TODO is it really needed?
    const handleMouseDown = (e: React.MouseEvent) => e.stopPropagation();

    if (!isWriting || !selectedItem) return <></>;

    const { scale } = canvasTransform;
    return (
        <div
            className="text-editor"
            style={{ left, top, width, height, transform: `scale(${scale})` }}
            onMouseDown={handleMouseDown}
        >
            <div
                ref={textBoxRef}
                className="text-box"
                style={{ color, font, textAlign, verticalAlign, width }}
                contentEditable
                dangerouslySetInnerHTML={{ __html: initText }}
                onInput={handleTextChange}
            />
        </div>
    );
};

export default TextEditor;
