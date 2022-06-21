import React, { HTMLAttributes } from 'react';
import styles from './MenuContainer.module.scss';

interface MenuContainer extends HTMLAttributes<HTMLDivElement> {
    ref?: React.RefObject<HTMLDivElement>;
}

const MenuContainer = ({ children, className, ref, ...rest }: MenuContainer): React.ReactElement => {
    return (
        <div ref={ref} className={` ${styles.menuContainer} ${className} `} {...rest}>
            {children}
        </div>
    );
};

export default MenuContainer;
