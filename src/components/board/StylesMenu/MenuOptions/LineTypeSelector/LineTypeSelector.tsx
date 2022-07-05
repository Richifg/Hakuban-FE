import React from 'react';
import { MenuItem, SubMenuButton } from '../../../../common';
import { LineType, LineStyle, IconName } from '../../../../../interfaces';

import styles from './LineTypeSelector.module.scss';

const lineTypeIcons: { [key in LineType]: IconName } = {
    straight: 'lineStraight',
    stepped: 'lineStepped',
    curved: 'lineCurved',
};

interface LineTypeSelector {
    onChange(value: string, key: keyof LineStyle): void;
    lineType: LineType;
}

const LineTypeSelector = ({ onChange, lineType }: LineTypeSelector): React.ReactElement => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onChange(e.currentTarget.value, 'lineType');
    };

    return (
        <MenuItem type="sub" iconName={lineTypeIcons[lineType]}>
            <div className={styles.lineTypeSelector}>
                {Object.entries(lineTypeIcons).map(([type, icon]) => (
                    <SubMenuButton
                        key={type}
                        iconName={icon}
                        onClick={handleClick}
                        value={type}
                        selected={lineType === type}
                        className={styles.lineTypeButton}
                    />
                ))}
            </div>
        </MenuItem>
    );
};

export default LineTypeSelector;
