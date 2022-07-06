import React, { useMemo, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from '../../../../hooks';
import { setCurrentAction } from '../../../../store/slices/boardSlice';
import { Align, BoardItem, Shape, Line, Text } from '../../../../interfaces';
import { processItemDeletions, processItemUpdates, updateStyles } from '../../../../BoardStateMachine/BoardStateMachineUtils';
import { isTextItem } from '../../../../utils';
import { MenuItem, MenuSeparator } from '../../../common';
import {
    AlignmentSelector,
    ColorSelector,
    FontSizeSelector,
    TextStyleSelector,
    ArrowSelector,
    LineTypeSelector,
    StrokeStyleSelector,
    ZIndexSelector,
} from '.';

interface MenuOptions {
    items: BoardItem[];
    onRender: () => void;
}

const MenuOptions = ({ items, onRender }: MenuOptions): React.ReactElement => {
    const dispatch = useDispatch();
    const { textStyle } = useSelector((s) => s.tools);
    const { itemsLock, userId } = useSelector((s) => s.connection);

    useLayoutEffect(() => {
        // let parent know options for new items have been rendered
        onRender();
    }, [items]);

    const handleChange = (value: string | number, key: string) => {
        const updateData = items.map(({ id }) => ({ id, [key]: value }));
        processItemUpdates(updateData);
        if (items.length === 1) updateStyles(items[0].type, key, value);
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
            if (items.length === 1) updateStyles(items[0].type, key, value);
        }
    };

    const handleDelete = () => {
        const ids = items.map((item) => item.id);
        processItemDeletions(ids);
        dispatch(setCurrentAction('IDLE'));
    };

    // only when all items have the appropiate attribute does the attribute style selector gets shown
    const show = useMemo(() => {
        let [fillColor, strokeStyles, textStyles, lineStyles, deleteButton] = Array(6).fill(true);
        items.forEach((item) => {
            if (!('fillColor' in item)) fillColor = false;
            if (!('lineWidth' in item)) strokeStyles = false;
            if (!('text' in item)) textStyles = false;
            if (item.type !== 'line') lineStyles = false;
            if (itemsLock[item.id] !== userId) deleteButton = false;
        });
        return { fillColor, strokeStyles, textStyles, lineStyles, deleteButton };
    }, [items, itemsLock, userId]);

    const item = items[0];
    return (
        <>
            {show.fillColor && (
                <>
                    <ColorSelector
                        type={item.type === 'note' ? 'note' : 'fill'}
                        onChange={handleChange}
                        color={(item as Shape).fillColor}
                    />
                    {!show.strokeStyles && <MenuSeparator />}
                </>
            )}
            {show.strokeStyles && (
                <>
                    <ColorSelector type="stroke" onChange={handleChange} color={(item as Shape).lineColor} />
                    <MenuSeparator />
                    <StrokeStyleSelector
                        onChange={handleChange}
                        pattern={(item as Shape).linePattern}
                        width={(item as Shape).lineWidth}
                    />
                    <MenuSeparator />
                </>
            )}
            {show.lineStyles && (
                <>
                    <LineTypeSelector onChange={handleChange} lineType={(item as Line).lineType} />
                    <MenuSeparator />
                    <ArrowSelector
                        onChange={handleChange}
                        arrow0Type={(item as Line).arrow0Type}
                        arrow2Type={(item as Line).arrow2Type}
                    />
                    <MenuSeparator />
                </>
            )}
            {show.textStyles && (
                <>
                    <ColorSelector type="text" onChange={handleNestedChange} color={(item as Text).text.fontColor} />
                    <AlignmentSelector
                        onChange={handleNestedChange}
                        vAlign={(item as Text).text.vAlign}
                        hAlign={(item as Text).text.hAlign}
                    />
                    <FontSizeSelector
                        onChange={handleNestedChange}
                        fontSize={(item as Text).text.fontSize}
                        fontFamily={(item as Text).text.fontFamily}
                    />
                    <TextStyleSelector
                        onChange={handleNestedChange}
                        bold={(item as Text).text.bold}
                        italic={(item as Text).text.italic}
                    />
                    <MenuSeparator />
                </>
            )}
            <ZIndexSelector onChange={handleChange} />
            {show.deleteButton && (
                <>
                    <MenuSeparator />
                    <MenuItem iconName="trash" type="button" onClick={handleDelete} />
                </>
            )}
        </>
    );
};

export default MenuOptions;
