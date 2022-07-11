import React from 'react';
import styles from './Animation.module.scss';

import base from '../../../assets/images/animation/base.svg';

import arm1 from '../../../assets/images/animation/arm1.svg';
import forearm1 from '../../../assets/images/animation/forearm1.svg';
import item1 from '../../../assets/images/animation/item1.svg';
import cover1 from '../../../assets/images/animation/cover1.svg';

import arm2 from '../../../assets/images/animation/arm2.svg';
import forearm2 from '../../../assets/images/animation/forearm2.svg';
import item2 from '../../../assets/images/animation/item2.svg';
import cover2 from '../../../assets/images/animation/cover2.svg';

import arm3 from '../../../assets/images/animation/arm3.svg';
import item3 from '../../../assets/images/animation/item3.svg';
import cover3 from '../../../assets/images/animation/cover3.svg';

const Animation = (): React.ReactElement => {
    return (
        <div className={styles.animation}>
            <img src={base} className={styles.base} />
            <img src={item1} className={styles.item1} />
            <img src={cover1} />
            <span className={`${styles.container} ${styles.arm1}`}>
                <img src={arm1} />
                <img src={forearm1} className={styles.forearm1} />
            </span>

            <img src={item2} className={styles.item2} />
            <span className={`${styles.container} ${styles.arm2}`}>
                <img src={arm2} />
                <img src={forearm2} className={styles.forearm2} />
            </span>
            <img src={cover2} />

            <img src={item3} className={styles.item3} />
            <span className={`${styles.container} ${styles.arm3}`}>
                <img src={arm3} />
            </span>
            <img src={cover3} />
        </div>
    );
};

export default Animation;
