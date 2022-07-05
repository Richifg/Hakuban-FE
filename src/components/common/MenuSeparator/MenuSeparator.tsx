import React from 'react';

import styles from './MenuSeparator.module.scss';

interface MenuSeparator {
    full?: boolean;
    horizontal?: boolean;
}

const MenuSeparator = ({ horizontal, full }: MenuSeparator): React.ReactElement => {
    return <span className={`${styles.menuSeparator} ${horizontal ? styles.horizontal : ''} ${full ? styles.full : ''}`} />;
};

export default MenuSeparator;
