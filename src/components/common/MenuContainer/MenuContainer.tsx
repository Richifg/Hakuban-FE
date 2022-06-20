import React, { HTMLAttributes } from 'react';
import styles from './MenuContainer.module.scss';

const MenuContainer: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className }): React.ReactElement => {
    return <div className={` ${styles.menuContainer} ${className} `}>{children}</div>;
};

export default MenuContainer;
