import React, { useState, useEffect } from 'react';
import kanban from '../../../assets/images/boards/kanban.png';

import styles from './Carousel.module.scss';

const slides = [kanban, kanban, kanban];

const Carousel = (): React.ReactElement => {
    const [slideOffset, setSlideOffset] = useState(0);

    useEffect(() => {
        const id = setTimeout(() => {
            const next = slideOffset < slides.length - 1 ? slideOffset + 1 : 0;
            setSlideOffset(next);
        }, 7500);
        return () => clearInterval(id);
    }, [slideOffset]);

    return (
        <div className={styles.carousel}>
            {slides.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    className={`${styles.slide} ${styles[`state${(index + slideOffset) % slides.length}`]}`}
                />
            ))}
        </div>
    );
};

export default Carousel;
