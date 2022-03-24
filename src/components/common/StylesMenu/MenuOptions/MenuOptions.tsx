import React from 'react';
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
import { Align, BoardItem } from '../../../../interfaces';
import { updateItem, addItem } from '../../../../store/slices/itemsSlice';
import './MenuOptions.scss';

interface MenuOptions {
    item: BoardItem;
}

const MenuOptions = ({ item }: MenuOptions): React.ReactElement => {
    const dispatch = useDispatch();
    const { textStyle } = useSelector((s) => s.tools);

    const handleChange = (value: string | number, key: string) => {
        if (key in item) {
            const { id } = item;
            dispatch(updateItem({ id, key, value }));
        }
    };

    const handleNestedChange = (value: string | Align | number | boolean, key: string) => {
        if ('text' in item && key in textStyle) {
            const text = item.text || { ...textStyle, content: '' };
            const newItem = { ...item, text: { ...text, [key]: value } };
            dispatch(addItem(newItem));
        }
    };

    const stopMouseDown = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div className="menu-options" onMouseDown={stopMouseDown}>
            {'fillColor' in item && <ColorSelector onChange={handleChange} styleKey="fillColor" />}
            {'lineColor' in item && <ColorSelector onChange={handleChange} styleKey="lineColor" />}
            {'lineWidth' in item && <WidthSelector value={item.lineWidth} />}
            {item.type === 'line' && (
                <>
                    <LineTypeSelector value={item.lineType} />
                    <ArrowSelector arrow0Type={item.arrow0Type} arrow2Type={item.arrow2Type} />
                </>
            )}
            {'text' in item && (
                <>
                    <AlignmentSelector onChange={handleNestedChange} styleKey="vAlign" />
                    <ColorSelector onChange={handleNestedChange} styleKey="textColor" />
                    <FontSizeSelector onChange={handleNestedChange} styleKey="fontSize" value={item.text?.fontSize || 0} />
                    <TextStyleSelector
                        onChange={handleNestedChange}
                        isBold={item.text?.bold}
                        isItalic={item.text?.italic}
                        boldKey="bold"
                        italicKey="italic"
                    />
                </>
            )}
            <ZIndexSelector />
        </div>
    );
};

export default MenuOptions;
