import React from 'react';
import { Icon, MenuContainer } from '../../common';
import { IconName } from '../../../interfaces';

import styles from './MenuItem.module.scss';

interface MenuItem {
    className?: string;
    iconName: IconName;
    selected?: boolean;
    onClick?: () => void;
    type?: 'button' | 'sub' | 'misc';
}

const MenuItem: React.FC<MenuItem> = ({
    children,
    className = '',
    iconName,
    selected,
    onClick,
    type = 'button',
}): React.ReactElement => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // dont let clicks go beyond, into menu to the canvas
        onClick && onClick();
    };

    return (
        <div tabIndex={0} className={`${styles.menuItem} ${className} ${selected ? styles.selected : ''}`} onClick={handleClick}>
            {type !== 'misc' && <Icon name={iconName} />}
            {type === 'sub' && <MenuContainer className={styles.subMenu}>{children}</MenuContainer>}
        </div>
    );
};

export default MenuItem;
