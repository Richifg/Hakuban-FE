import React from 'react';
import { useDispatch, useSelector } from '../../../../hooks';
import { AlignmentSelector, ColorSelector, FontSizeSelector, LineSelector, TextStyleSelector } from '../';
import { Align, BoardItem } from '../../../../interfaces';
import { addUserItem } from '../../../../store/slices/itemsSlice';
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
            dispatch(addUserItem(newItem));
        }
    };

    const handleNestedChange = (value: string | Align | number | boolean, key: string) => {
        if ('text' in item && key in textStyle) {
            const text = item.text || { ...textStyle, content: '' };
            const newItem = { ...item, text: { ...text, [key]: value } };
            dispatch(addUserItem(newItem));
        }
    };

    const stopMouseDown = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div className="menu-options" onMouseDown={stopMouseDown}>
            {item.type === 'shape' && <ColorSelector onChange={handleChange} styleKey="fillColor" />}
            {item.type === 'shape' && <ColorSelector onChange={handleChange} styleKey="lineColor" />}
            {(item.type === 'note' || item.type === 'drawing') && <ColorSelector onChange={handleChange} styleKey="color" />}
            {item.type === 'shape' && <LineSelector onChange={handleChange} styleKey="lineWidth" value={item.lineWidth} />}
            {item.type === 'drawing' && <LineSelector onChange={handleChange} styleKey="width" value={item.width} />}
            {'text' in item && (
                <>
                    <AlignmentSelector onChange={handleNestedChange} styleKey="vAlign" />
                    <AlignmentSelector onChange={handleNestedChange} styleKey="hAlign" />
                    <ColorSelector onChange={handleNestedChange} styleKey="color" />
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
