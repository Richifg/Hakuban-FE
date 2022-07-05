import React from 'react';
import styles from './Input.module.scss';

const Input = ({ className, ...rest }: React.HTMLProps<HTMLInputElement>): React.ReactElement => {
    return <input className={`${styles.input} ${className}`} {...rest} />;
};

export default Input;
