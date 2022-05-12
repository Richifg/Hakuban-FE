import React, { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { getPositionCSSVars, getTextAreaCoordinates, isTextItem } from '../../../utils';
import { useSelector, useDebouncedCallback } from '../../../hooks';
import { BoardItem, BoardTextItem, TextData } from '../../../interfaces';
import { processItemUpdates } from '../../../BoardStateMachine/BoardStateMachineUtils';

import './TextEditor.scss';

function processTextUpdate(item: BoardTextItem, data: Partial<TextData>) {
    const updateData = { id: item.id, text: { ...item.text, ...data } };
    processItemUpdates(updateData);
}

const TextEditor = (): React.ReactElement => {
    const { canvasTransform, isWriting } = useSelector((s) => s.board);
    const { textStyle } = useSelector((s) => s.tools);
    const { items, selectedItemIds } = useSelector((s) => s.items);
    const [initText, setInitText] = useState('');
    const textBoxRef = useRef<HTMLDivElement>(null);
    const selectedItem = selectedItemIds.length === 1 ? items[selectedItemIds[0]] : undefined;

    // keep last selected item on ref so it can be used inside debounce callback
    const lastSelectedItemRef = useRef<BoardItem>();
    useEffect(() => {
        lastSelectedItemRef.current = selectedItem;
    }, [selectedItem]);

    // updates initial display text when selected item id changes
    useLayoutEffect(() => {
        if (isTextItem(selectedItem) && selectedItem.text) {
            const text = selectedItem.text.content;
            const htmlText = text.replaceAll(/\/n/g, '<br/>');
            setInitText(htmlText);
        } else {
            setInitText('');
        }
        // also cleanup text from lastSelectedItem if it was a textItem
        const lastItem = lastSelectedItemRef.current;
        if (isTextItem(lastItem) && lastItem.text) {
            // cleans unerasable final enter when writing into content editable html
            let content = lastItem.text.content;
            if (content.slice(-2) === '/n') content = content.substring(0, content.length - 2);
            processTextUpdate(lastItem, { content, skipRendering: false });
        }
    }, [selectedItem?.id]);

    // update skip rendering so canvas doesnt double render text of edited item
    useEffect(() => {
        if (isWriting) {
            textBoxRef.current?.focus();
            // if selected item had text, it needs to be skipped
            if (isTextItem(selectedItem) && selectedItem.text) {
                processTextUpdate(selectedItem, { skipRendering: true });
            }
        }
    }, [isWriting]);

    // handles update of item's text
    const handleTextChange = useDebouncedCallback((e: React.ChangeEvent<HTMLDivElement>) => {
        const lastItem = lastSelectedItemRef.current;
        if (!isWriting && isTextItem(lastItem)) {
            // clean html from textbox
            const content = e.target.innerHTML
                .replace(/\<br\/?\>/g, '/n') // line breaks into new line chars
                .replace(/\&nbsp;/g, ' ') // nbsp's into spaces
                .replace(/(\<\/?span[^\>]*\>)/g, ''); // remove span tags
            // add new text content to item
            if (lastItem.text) processTextUpdate(lastItem, { content });
            else processTextUpdate({ ...lastItem, text: { ...textStyle, content, skipRendering: true } }, {});
        }
    }, 200);

    // css style vars for texteditor
    const [color, font, textAlign, verticalAlign] = useMemo(() => {
        const source = (isTextItem(selectedItem) && selectedItem?.text) || textStyle;
        const { textColor, fontSize, fontFamily, hAlign, vAlign, bold, italic } = source;
        const verticalAlign = vAlign == 'start' ? ' top' : vAlign == 'end' ? 'bottom' : 'middle';
        const font = `${italic ? 'italic' : 'normal'} ${bold ? 'bold' : 'normal'} ${fontSize}px ${fontFamily}`;
        return [textColor, font, hAlign, verticalAlign];
    }, [selectedItem, textStyle]);

    // css position vars for texteditor
    const { left, top, width, height } = useMemo(() => {
        if (!selectedItem) return { left: 0, top: 0, width: 0, height: 0 };
        const { type } = selectedItem;
        if (type === 'shape' || type === 'note') {
            const coordinates = getTextAreaCoordinates(selectedItem);
            return getPositionCSSVars(canvasTransform, coordinates);
        } else {
            const { x0, y0, x2, y2 } = selectedItem;
            return getPositionCSSVars(canvasTransform, { x0, y0, x2, y2 });
        }
    }, [canvasTransform, selectedItem]);

    // avoid dragging element when text editor is opened (text editor covers element)
    const handleMouseDown = (e: React.MouseEvent) => e.stopPropagation();

    if (!isWriting || !isTextItem(selectedItem)) return <></>;
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
