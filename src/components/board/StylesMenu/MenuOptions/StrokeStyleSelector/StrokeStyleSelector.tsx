import React from 'react';
import { MAX_LINE_WIDTH } from '../../../../../constants';
import { LinePattern, LineStyle } from '../../../../../interfaces';
import { MenuItem, SubMenuButton, RangeInput, MenuSeparator } from '../../../../common';

import styles from './StrokeStyleSelector.module.scss';
import patternOptions from './options';

interface StrokeStyleSelector {
    onChange(value: number, key: keyof LineStyle): void;
    pattern: LinePattern;
    width: number;
}

const StrokeStyleSelector = ({ onChange, pattern, width }: StrokeStyleSelector): React.ReactElement => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const pattern = parseInt(e.currentTarget.value);
        onChange(pattern, 'linePattern');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const width = parseInt(e.currentTarget.value);
        onChange(width, 'lineWidth');
    };

    return (
        <MenuItem type="sub" iconName="lineWidth">
            <div className={styles.strokeStyleSelector}>
                <div className={styles.linePatterns}>
                    {patternOptions.map(([linePattern, icon]) => (
                        <SubMenuButton
                            key={icon}
                            iconName={icon}
                            value={linePattern.toString()}
                            onClick={handleClick}
                            selected={linePattern === pattern}
                        />
                    ))}
                </div>
                <MenuSeparator horizontal full />
                <RangeInput onChange={handleChange} value={width} min={0} max={MAX_LINE_WIDTH} label="Line width" />
            </div>
        </MenuItem>
    );
};

export default StrokeStyleSelector;
