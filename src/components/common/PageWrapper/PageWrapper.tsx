import React, { useEffect, useState } from 'react';
import styles from './PageWrapper.module.scss';

const DESIGN_WIDTH = 1722;
const DESIGN_HEIGHT = 969;
const DESIGN_RATIO = DESIGN_WIDTH / DESIGN_HEIGHT;

interface PageWrapper {
    wrapperClassName?: string;
    contentClassName?: string;
}

const PageWrapper: React.FC<PageWrapper> = ({ children, wrapperClassName, contentClassName }): React.ReactElement => {
    const [maxHeight, setMaxHeight] = useState('100%');
    const [maxWidth, setMaxWidth] = useState('100%');
    const [fontSize, setFontSize] = useState('16px');

    // subscribe to window resize events
    useEffect(() => {
        const resizeHandler = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const ratio = width / height;
            if (ratio > DESIGN_RATIO) {
                setMaxWidth(`${height * DESIGN_RATIO}px`);
                setMaxHeight('100%');
                setFontSize(`${16 * (height / DESIGN_HEIGHT)}px`);
            } else {
                if (ratio < 1.25) setFontSize('1rem');
                else setFontSize(`${16 * (width / DESIGN_WIDTH)}px`);
                setMaxWidth('100%');
                setMaxHeight('100%');
            }
        };
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    return (
        <div style={{ fontSize }} className={`${styles.pageWrapper} ${wrapperClassName}`}>
            <div style={{ maxWidth, maxHeight }} className={`${styles.pageContent} ${contentClassName}`}>
                {children}
            </div>
        </div>
    );
};

export default PageWrapper;
