import React from 'react';
import styles from './Button.module.scss';

const Button = ({ children, className, ...rest }: React.HTMLProps<HTMLButtonElement>): React.ReactElement => {
    return (
        <button className={`${styles.button} ${className}`} {...rest} type="button">
            {children}
        </button>
    );
};

export default Button;
