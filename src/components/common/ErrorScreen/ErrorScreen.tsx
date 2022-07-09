import React, { useState, useEffect } from 'react';
import { Icon, Button } from '..';

import styles from './ErrorScreen.module.scss';

interface ErrorScreen {
    text: string;
    title?: string;
    onClose(): void;
    onTryAgain(): void;
}

const ErrorScreen = ({ text, title = 'Error', onClose, onTryAgain }: ErrorScreen): React.ReactElement => {
    const [mount, setMount] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        let id: NodeJS.Timeout;
        if (!text) {
            setShow(false);
            id = setTimeout(() => setMount(false), 200);
        } else {
            setMount(true);
            id = setTimeout(() => setShow(true), 0);
        }
        return () => clearTimeout(id);
    }, [text]);

    if (!mount) return <></>;
    return (
        <div className={styles.container}>
            <div className={`${styles.content} ${show ? styles.show : ''}`}>
                <Icon name="alert" className={styles.icon} />
                <p className={styles.title}>{title}</p>
                <p className={styles.description}>{text}</p>
                <Button
                    className={styles.button}
                    onClick={() => {
                        console.log('onTryAgain', onTryAgain);
                        onTryAgain();
                    }}
                >
                    Try again
                </Button>
                <button className={styles.closeButton} onClick={onClose}>
                    <Icon name="plus" />
                </button>
            </div>
        </div>
    );
};

export default ErrorScreen;
