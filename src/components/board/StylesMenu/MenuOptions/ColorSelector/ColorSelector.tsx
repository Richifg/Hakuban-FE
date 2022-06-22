import React from 'react';
import { ShapeStyle, TextStyle, IconName } from '../../../../../interfaces';
import { ColorPallete, MenuItem } from '../../../../common';
import { TEXT_COLORS, FILL_STROKE_COLORS, NOTE_COLORS } from '../../../../../constants';

type ColorSelectorType = 'fill' | 'stroke' | 'note' | 'text';

const settingsByType: {
    [key in ColorSelectorType]: { styleKey: keyof ShapeStyle | keyof TextStyle; icon: IconName; colors: string[] };
} = {
    fill: { styleKey: 'fillColor', icon: 'fill', colors: FILL_STROKE_COLORS },
    stroke: { styleKey: 'lineColor', icon: 'outline', colors: FILL_STROKE_COLORS },
    note: { styleKey: 'fillColor', icon: 'fill', colors: NOTE_COLORS },
    text: { styleKey: 'fontColor', icon: 'font1', colors: TEXT_COLORS },
};

interface ColorSelector {
    type: ColorSelectorType;
    color: string;
    onChange(value: string, key: string): void;
}

const ColorSelector = ({ color, onChange, type }: ColorSelector): React.ReactElement => {
    const { styleKey, icon, colors } = settingsByType[type];

    const handleChange = (color: string) => {
        onChange(color, styleKey);
    };

    return (
        <MenuItem type="sub" iconName={icon} style={{ color }}>
            <ColorPallete defaultOptions={colors} color={color} onChange={handleChange} />
        </MenuItem>
    );
};

export default ColorSelector;
