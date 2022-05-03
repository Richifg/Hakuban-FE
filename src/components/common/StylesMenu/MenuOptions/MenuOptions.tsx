import React, { useMemo, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from '../../../../hooks';
import { deleteItems } from '../../../../store/slices/itemsSlice';
import { setCurrentAction } from '../../../../store/slices/boardSlice';
import { Align, BoardItem, Shape, Line, Text } from '../../../../interfaces';
import { processItemUpdates } from '../../../../BoardStateMachine/BoardStateMachineUtils';
import {
    AlignmentSelector,
    ColorSelector,
    FontSizeSelector,
    WidthSelector,
    TextStyleSelector,
    ArrowSelector,
    LineTypeSelector,
    ZIndexSelector,
} from '.';
import './MenuOptions.scss';
import { isTextItem } from '../../../../utils';

interface MenuOptions {
    items: BoardItem[];
    onRender: () => void;
}

const MenuOptions = ({ items, onRender }: MenuOptions): React.ReactElement => {
    const dispatch = useDispatch();
    const { textStyle } = useSelector((s) => s.tools);

    useLayoutEffect(() => {
        // let parent know options for new items have been rendered
        onRender();
    }, [items]);

    const handleChange = (value: string | number, key: string) => {
        const updateData = items.map(({ id }) => ({ id, [key]: value }));
        processItemUpdates(updateData);
    };

    // nested change is only used for the text property of items
    const handleNestedChange = (value: string | Align | number | boolean, key: string) => {
        if (key in textStyle) {
            const updateData = items.filter(isTextItem).map((item) => {
                const oldText = item.text || { ...textStyle, content: '' };
                const newText = { ...oldText, [key]: value };
                return { id: item.id, text: newText };
            });
            processItemUpdates(updateData);
        }
    };

    const handleDelete = () => {
        dispatch(deleteItems(items.map((item) => item.id)));
        dispatch(setCurrentAction('IDLE'));
    };

    const stopMouseDown = (e: React.MouseEvent) => e.stopPropagation();

    // only when all items have the appropiate attribute does the attribute style selector gets shown
    const { showFillColor, showLineColor, showLineWidth, showTextStyles, showLineStyles } = useMemo(() => {
        let [showFillColor, showLineColor, showLineWidth, showTextStyles, showLineStyles] = [true, true, true, true, true];
        items.forEach((item) => {
            if (!('fillColor' in item)) showFillColor = false;
            if (!('lineWidth' in item)) showLineWidth = false;
            if (!('lineColor' in item)) showLineColor = false;
            if (!('text' in item)) showTextStyles = false;
            if (item.type !== 'line') showLineStyles = false;
        });
        return { showFillColor, showLineColor, showLineWidth, showTextStyles, showLineStyles };
    }, [items]);

    const item = items[0];
    return (
        <div className="menu-options" onMouseDown={stopMouseDown}>
            {showFillColor && <ColorSelector onChange={handleChange} styleKey="fillColor" color={(item as Shape).fillColor} />}
            {showLineColor && <ColorSelector onChange={handleChange} styleKey="lineColor" color={(item as Shape).lineColor} />}
            {showLineWidth && <WidthSelector onChange={handleChange} width={(item as Shape).lineWidth} />}
            {showLineStyles && (
                <>
                    <LineTypeSelector onChange={handleChange} lineType={(item as Line).lineType} />
                    <ArrowSelector
                        onChange={handleChange}
                        arrow0Type={(item as Line).arrow0Type}
                        arrow2Type={(item as Line).arrow2Type}
                    />
                </>
            )}
            {showTextStyles && (
                <>
                    <AlignmentSelector onChange={handleNestedChange} styleKey="vAlign" align={(item as Text).text.vAlign} />
                    <AlignmentSelector onChange={handleNestedChange} styleKey="hAlign" align={(item as Text).text.hAlign} />
                    <ColorSelector onChange={handleNestedChange} styleKey="textColor" color={(item as Text).text.textColor} />
                    <FontSizeSelector onChange={handleNestedChange} fontSize={(item as Text).text.fontSize} />
                    <TextStyleSelector
                        onChange={handleNestedChange}
                        bold={(item as Text).text.bold}
                        italic={(item as Text).text.italic}
                    />
                </>
            )}
            <ZIndexSelector onChange={handleChange} />
            <button onClick={handleDelete}>DEL</button>
        </div>
    );
};

export default MenuOptions;
