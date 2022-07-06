import React, { HTMLAttributes } from 'react';
import { IconName } from '../../../interfaces';
import { Icon } from '../../common';

import styles from './SubMenuButton.module.scss';

interface SubMenuButton extends HTMLAttributes<HTMLButtonElement> {
    iconName: IconName;
    selected?: boolean;
    value: string;
}

const SubMenuButton = ({ className, iconName, selected, value, ...rest }: SubMenuButton): React.ReactElement => {
    return (
        <button
            className={`${styles.subMenuButton} ${selected ? styles.selected : ''} ${className || ''}`}
            {...rest}
            value={value}
        >
            <Icon name={iconName} />
        </button>
    );
};

export default SubMenuButton;
