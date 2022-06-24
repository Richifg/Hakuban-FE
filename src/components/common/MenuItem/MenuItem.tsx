import React from 'react';
import { Icon, MenuContainer } from '../../common';
import { IconName } from '../../../interfaces';

import styles from './MenuItem.module.scss';

interface MenuItem extends React.HTMLProps<HTMLDivElement> {
    iconName?: IconName;
    selected?: boolean;
    onClick?: () => void;
    type?: 'button' | 'sub' | 'misc';
    direction?: 'down' | 'right';
}

const MenuItem: React.FC<MenuItem> = ({
    children,
    className,
    iconName,
    selected,
    onClick,
    type = 'button',
    direction = 'down',
    ...rest
}): React.ReactElement => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // dont let clicks go beyond, into menu to the canvas
        onClick && onClick();
    };

    return (
        <div
            className={`${styles.menuItem} ${className} ${selected ? styles.selected : ''} ${
                type === 'button' ? styles.button : ''
            }`}
            onClick={handleClick}
            {...rest}
        >
            {type === 'misc' && children}
            {type !== 'misc' && <Icon name={iconName || 'circle'} />}
            {type === 'sub' && <MenuContainer className={`${styles.subMenu} ${styles[direction]}`}>{children}</MenuContainer>}
        </div>
    );
};

export default MenuItem;
