import React, { ChangeEvent } from 'react';
import { TextStyle, IconName } from '../../../../../interfaces';
import { MenuItem, SubMenuButton, RangeInput, MenuSeparator } from '../../../../common';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../../../../../constants';

import styles from './FontSizeSelector.module.scss';

const fontFamilyIcons: { [key: string]: IconName } = {
    '"Times New Roman", Times, serif': 'font1',
    'Arial, Helvetica, sans-serif': 'font2',
    '"Segoe script", cursive': 'font3',
};

interface FontSizeSelector {
    fontFamily: string;
    fontSize: number;
    onChange(value: number | string, key: keyof TextStyle): void;
}

const FontSizeSelector = ({ fontSize, fontFamily, onChange }: FontSizeSelector): React.ReactElement => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.currentTarget.value);
        onChange(value, 'fontSize');
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const font = e.currentTarget.value;
        console.log('changing to', font);
        onChange(font, 'fontFamily');
    };

    return (
        <MenuItem type="sub" iconName={fontFamilyIcons[fontFamily] || 'font1'}>
            <div className={styles.fontSizeSelector}>
                <div className={styles.familyOptions}>
                    {Object.entries(fontFamilyIcons).map(([font, icon]) => (
                        <SubMenuButton
                            key={font}
                            iconName={icon}
                            onClick={handleClick}
                            value={font}
                            selected={font === fontFamily}
                        />
                    ))}
                </div>
                <MenuSeparator horizontal full />
                <RangeInput min={MIN_FONT_SIZE} max={MAX_FONT_SIZE} onChange={handleChange} value={fontSize} label="Font size" />
            </div>
        </MenuItem>
    );
};

export default FontSizeSelector;
