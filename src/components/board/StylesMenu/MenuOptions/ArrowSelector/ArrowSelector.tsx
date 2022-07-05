import React from 'react';
import { ArrowType, LineStyle, IconName } from '../../../../../interfaces';
import { MenuItem, SubMenuButton } from '../../../../common';
import styles from './ArrowSelector.module.scss';

const arrowIcons: { [key in ArrowType]: IconName } = {
    none: 'arrowNone',
    triangle: 'arrowTriangle',
    simple: 'arrowSimple',
    circle: 'arrowCircle',
};

interface ArrowSelector {
    onChange(value: ArrowType, key: keyof LineStyle): void;
    arrow0Type: ArrowType;
    arrow2Type: ArrowType;
}

const ArrowSelector = ({ onChange, arrow0Type, arrow2Type }: ArrowSelector): React.ReactElement => {
    const handleArrowChange = (index: 0 | 2) => (e: React.MouseEvent<HTMLButtonElement>) => {
        const key: keyof LineStyle = `arrow${index}Type`;
        const value = e.currentTarget.value as ArrowType;
        onChange(value, key);
    };

    const handleSwap = () => {
        onChange(arrow2Type, 'arrow0Type');
        onChange(arrow0Type, 'arrow2Type');
    };

    return (
        <>
            <MenuItem type="sub" className={`${styles.arrowSelector}  ${styles.flipIcon}`} iconName={arrowIcons[arrow0Type]}>
                <div className={styles.arrowOptions}>
                    {Object.entries(arrowIcons).map(([type, icon]) => (
                        <SubMenuButton
                            key={type}
                            value={type}
                            selected={type === arrow0Type}
                            iconName={icon}
                            onClick={handleArrowChange(0)}
                        />
                    ))}
                </div>
            </MenuItem>
            <MenuItem type="button" iconName="swap" onClick={handleSwap} />
            <MenuItem type="sub" className={styles.arrowSelector} iconName={arrowIcons[arrow2Type]}>
                <div className={styles.arrowOptions}>
                    {Object.entries(arrowIcons).map(([type, icon]) => (
                        <SubMenuButton
                            key={type}
                            value={type}
                            selected={type === arrow2Type}
                            iconName={icon}
                            onClick={handleArrowChange(2)}
                        />
                    ))}
                </div>
            </MenuItem>
        </>
    );
};

export default ArrowSelector;
