import React, { useEffect, useState } from 'react';
import styles from './PageWrapper.module.scss';

const DESIGN_WIDTH = 1722;
const DESIGN_HEIGHT = 969;

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
            if (width > (height * 16) / 9) {
                setMaxWidth(`${height * 1.778}px`); // 16:9
                setMaxHeight('100%');
                setFontSize(`${16 * (height / DESIGN_HEIGHT)}px`);
            } else {
                setMaxHeight(`100%`); // TODO
                setMaxWidth('100%');
                setFontSize(`${16 * (width / DESIGN_WIDTH)}px`);
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
