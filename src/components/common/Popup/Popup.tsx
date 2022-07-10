import React, { useRef, useState } from 'react';
import styles from './Popup.module.scss';

interface Popup {
    children: React.ReactNode;
    mode?: 'hover' | 'click';
    text: string;
}

const Popup = ({ text, mode = 'click', children }: Popup): React.ReactElement => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [show, setShow] = useState(false);

    const handleClick = () => {
        if (mode === 'click') {
            setShow(true);
            setTimeout(() => setShow(false), 2500);
        }
    };

    const handleEnter = () => {
        if (mode === 'hover') setShow(true);
    };

    const handleLeave = () => {
        if (mode === 'hover') setShow(false);
    };

    return (
        <span
            ref={containerRef}
            className={styles.container}
            onClick={handleClick}
            onPointerEnter={handleEnter}
            onPointerLeave={handleLeave}
        >
            {children}
            <span className={`${styles.popup} ${show ? styles.show : ''}`}>{text}</span>
        </span>
    );
};

export default Popup;
