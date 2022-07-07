import React from 'react';
import styles from './Animation.module.scss';

import base from '../../../assets/images/animation/base.svg';
import arm1 from '../../../assets/images/animation/arm1.svg';
import forearm1 from '../../../assets/images/animation/forearm1.svg';
import item1 from '../../../assets/images/animation/item1.svg';

const Animation = (): React.ReactElement => {
    return (
        <div className={styles.animation}>
            <img src={base} className={styles.base} />
            <img src={item1} className={styles.item1} />
            <span className={`${styles.container} ${styles.arm1}`}>
                <img src={arm1} />
                <img src={forearm1} className={styles.forearm1} />
            </span>
        </div>
    );
};

export default Animation;
