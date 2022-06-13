import React, { useMemo, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from '../../../../hooks';
import { setCurrentAction } from '../../../../store/slices/boardSlice';
import { Align, BoardItem, Shape, Line, Text } from '../../../../interfaces';
import { processItemDeletions, processItemUpdates } from '../../../../BoardStateMachine/BoardStateMachineUtils';
import {
    AlignmentSelector,
    ColorSelector,
    FontSizeSelector,
    WidthSelector,
    TextStyleSelector,
    ArrowSelector,
    LineTypeSelector,
    LinePatternSelector,
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
    const { itemsLock, userId } = useSelector((s) => s.connection);

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
        const ids = items.map((item) => item.id);
        processItemDeletions(ids);
        dispatch(setCurrentAction('IDLE'));
    };

    const stopMouseDown = (e: React.MouseEvent) => e.stopPropagation();

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
        <div className="menu-options" onMouseDown={stopMouseDown}>
            {show.fillColor && <ColorSelector onChange={handleChange} styleKey="fillColor" color={(item as Shape).fillColor} />}
            {show.strokeStyles && (
                <>
                    <ColorSelector onChange={handleChange} styleKey="lineColor" color={(item as Shape).lineColor} />
                    <WidthSelector onChange={handleChange} width={(item as Shape).lineWidth} />
                    <LinePatternSelector onChange={handleChange} pattern={(item as Shape).linePattern} />
                </>
            )}
            {show.lineStyles && (
                <>
                    <LineTypeSelector onChange={handleChange} lineType={(item as Line).lineType} />
                    <ArrowSelector
                        onChange={handleChange}
                        arrow0Type={(item as Line).arrow0Type}
                        arrow2Type={(item as Line).arrow2Type}
                    />
                </>
            )}
            {show.textStyles && (
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
            {show.deleteButton && <button onClick={handleDelete}>DEL</button>}
        </div>
    );
};

export default MenuOptions;
