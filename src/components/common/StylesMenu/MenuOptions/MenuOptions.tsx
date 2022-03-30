import React, { useMemo } from 'react';
import { useDispatch, useSelector } from '../../../../hooks';
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
import { Align, BoardItem, Shape, Line, Text } from '../../../../interfaces';
import { updateItem, addItem } from '../../../../store/slices/itemsSlice';
import './MenuOptions.scss';

interface MenuOptions {
    items: BoardItem[];
}

const MenuOptions = ({ items }: MenuOptions): React.ReactElement => {
    const dispatch = useDispatch();
    const { textStyle } = useSelector((s) => s.tools);

    const handleChange = (value: string | number, key: string) => {
        items.forEach((item) => {
            if (key in item) {
                const { id } = item;
                dispatch(updateItem({ id, key, value }));
            }
        });
    };

    // nested change is only used for the text property of items
    const handleNestedChange = (value: string | Align | number | boolean, key: string) => {
        items.forEach((item) => {
            if ('text' in item && key in textStyle) {
                const text = item.text || { ...textStyle, content: '' };
                const newItem = { ...item, text: { ...text, [key]: value } };
                dispatch(addItem(newItem));
            }
        });
    };

    const stopMouseDown = (e: React.MouseEvent) => e.stopPropagation();

    // only when all items have the appropiate attribute does the attribute style selector gets shown
    const { showFillColor, showLineColor, showLineWidth, showTextStyles, showLineStyles } = useMemo(() => {
        let showFillColor = true;
        let showLineColor = true;
        let showLineWidth = true;
        let showTextStyles = true;
        let showLineStyles = true;
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
            <ZIndexSelector items={items} />
        </div>
    );
};

export default MenuOptions;
