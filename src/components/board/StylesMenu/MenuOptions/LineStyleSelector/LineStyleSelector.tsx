import React from 'react';
import { MAX_LINE_WIDTH } from '../../../../../constants';
import { LinePattern, LineStyle } from '../../../../../interfaces';
import { MenuItem, SubMenuButton, RangeInput } from '../../../../common';

import styles from './LineStyleSelector.module.scss';
import patternOptions from './options';

const patternKey: keyof LineStyle = 'linePattern';
const widthKey: keyof LineStyle = 'lineWidth';

interface LinePattermSelector {
    onChange(value: number, key: string): void;
    pattern: LinePattern;
    width: number;
}

const LinePattermSelector = ({ onChange, pattern, width }: LinePattermSelector): React.ReactElement => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const pattern = parseInt(e.currentTarget.value);
        onChange(pattern, patternKey);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const width = parseInt(e.currentTarget.value);
        onChange(width, widthKey);
    };

    return (
        <MenuItem type="sub" iconName="lineStyle">
            <div className={styles.lineStyleSelector}>
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
                <RangeInput onChange={handleChange} value={width} min={0} max={MAX_LINE_WIDTH} />
                <label className={styles.widthLabel}>Line width</label>
            </div>
        </MenuItem>
    );
};

export default LinePattermSelector;
