import React, { HTMLAttributes } from 'react';
import styles from './MenuContainer.module.scss';

interface MenuContainer extends HTMLAttributes<HTMLDivElement> {
    divRef?: React.RefObject<HTMLDivElement>;
}

const MenuContainer = ({ children, className, divRef, ...rest }: MenuContainer): React.ReactElement => {
    return (
        <div ref={divRef} className={` ${styles.menuContainer} ${className} `} {...rest}>
            {children}
        </div>
    );
};

export default MenuContainer;
