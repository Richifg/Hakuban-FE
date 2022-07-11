import React, { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.scss';

interface LoadingScreen {
    text?: string;
    active?: boolean;
    closeDelay?: number; // ms
}

const LoadingScreen = ({ text, active, closeDelay = 0 }: LoadingScreen): React.ReactElement => {
    const [mount, setMount] = useState(false); // mounts or dismounts the whole component
    const [animate, setAnimate] = useState(false); // phase in or out (opacity)
    const [buffer, setBuffer] = useState(true); // avoids a loading screen from showing for too short of a time (flicker)

    useEffect(() => {
        let id: NodeJS.Timeout;
        // mount and phase in or start buffer to unmount
        if (active) {
            setMount(true);
            id = setTimeout(() => setAnimate(true), 0);
        } else {
            id = setTimeout(() => setBuffer(false), closeDelay);
        }
        return () => clearTimeout(id);
    }, [active]);

    useEffect(() => {
        // phase out and unmount everything after a while
        if (!buffer) {
            setAnimate(false);
            setTimeout(() => setMount(false), 300);
            setBuffer(true);
        }
    }, [buffer]);

    if (!mount) return <></>;
    else {
        return (
            <div className={`${styles.container} ${animate ? styles.animate : ''}`}>
                <div className={styles.content}>
                    <p className={styles.text}>{text}</p>
                    <span className={styles.loader}>
                        <span>
                            <span />
                        </span>
                        <span>
                            <span />
                        </span>
                        <span>
                            <span />
                        </span>
                        <span>
                            <span />
                        </span>
                    </span>
                </div>
            </div>
        );
    }
};

export default LoadingScreen;

LoadingScreen.defaultProps = {
    text: 'Connecting',
    active: false,
};
