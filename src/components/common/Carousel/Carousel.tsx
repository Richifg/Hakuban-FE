import React, { useState, useEffect } from 'react';
import kanban from '../../../assets/images/boards/kanban.png';
import mindMap from '../../../assets/images/boards/mind_map.png';
import flow from '../../../assets/images/boards/flow.png';

import styles from './Carousel.module.scss';

const slides = [kanban, mindMap, flow];
const alts = ['whiteboard kanban example', 'whiteboard mind map example', 'whiteboard flow example'];

const Carousel = (): React.ReactElement => {
    const [slideOffset, setSlideOffset] = useState(0);

    useEffect(() => {
        const id = setTimeout(() => {
            const next = slideOffset < slides.length - 1 ? slideOffset + 1 : 0;
            setSlideOffset(next);
        }, 6000);
        return () => clearInterval(id);
    }, [slideOffset]);

    return (
        <div className={styles.carousel}>
            {slides.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    className={`${styles.slide} ${styles[`state${(index + slideOffset) % slides.length}`]}`}
                    alt={alts[index]}
                />
            ))}
        </div>
    );
};

export default Carousel;
