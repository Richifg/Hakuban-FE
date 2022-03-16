import React from 'react';
import { useDispatch, useSelector } from '../../../../hooks';
import { AlignmentSelector, ColorSelector, FontSizeSelector, LineSelector, TextStyleSelector, ArrowSelector } from '.';
import { Align, BoardItem } from '../../../../interfaces';
import { addItem } from '../../../../store/slices/itemsSlice';
import './MenuOptions.scss';

interface MenuOptions {
    item: BoardItem;
}

const MenuOptions = ({ item }: MenuOptions): React.ReactElement => {
    const dispatch = useDispatch();
    const { textStyle } = useSelector((s) => s.tools);

    const handleChange = (value: string | number, key: string) => {
        if (key in item) {
            const newItem = { ...item, [key]: value };
            dispatch(addItem(newItem));
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
            {'lineWidth' in item && <LineSelector onChange={handleChange} styleKey="lineWidth" value={item.lineWidth} />}
            {item.type === 'line' && (
                <ArrowSelector
                    onChange={handleChange}
                    arrow0={item.arrow0Type}
                    arrow2={item.arrow2Type}
                    arrow0Key="arrow0Type"
                    arrow2Key="arrow2Type"
                />
            )}
            {'text' in item && (
                <>
                    <AlignmentSelector onChange={handleNestedChange} styleKey="vAlign" />
                    <AlignmentSelector onChange={handleNestedChange} styleKey="hAlign" />
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
        </div>
    );
};

export default MenuOptions;
