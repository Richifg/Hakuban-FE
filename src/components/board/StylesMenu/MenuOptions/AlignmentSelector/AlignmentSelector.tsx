import React from 'react';
import { Align, TextStyle } from '../../../../../interfaces';
import { MenuItem, SubMenuButton } from '../../../../common';

import { vOptions, hOptions } from './options';
import styles from './AlignmentSelector.module.scss';

interface AligmentSelector {
    vAlign: Align;
    hAlign: Align;
    onChange(value: Align, key: string): void;
}

const AligmentSelector = ({ onChange, vAlign, hAlign }: AligmentSelector): React.ReactElement => {
    const handleChange = (key: keyof TextStyle) => (e: React.MouseEvent<HTMLButtonElement>) => {
        const align = e.currentTarget.value as Align;
        onChange(align, key);
    };

    return (
        <MenuItem iconName="justifyCenter" type="sub">
            <div className={styles.alignmentSelector}>
                {vOptions.map(([align, icon]) => (
                    <SubMenuButton
                        key={icon}
                        onClick={handleChange('vAlign')}
                        value={align}
                        iconName={icon}
                        selected={align === vAlign}
                    />
                ))}
                {hOptions.map(([align, icon]) => (
                    <SubMenuButton
                        key={icon}
                        onClick={handleChange('hAlign')}
                        value={align}
                        iconName={icon}
                        selected={align === hAlign}
                    />
                ))}
            </div>
        </MenuItem>
    );
};

export default AligmentSelector;
