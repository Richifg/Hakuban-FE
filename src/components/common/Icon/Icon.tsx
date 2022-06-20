import React from 'react';
import { IconName } from '../../../interfaces';

interface Icon {
    className?: string;
    name: IconName;
}

const Icon: React.FC<Icon> = ({ name, className = '' }): React.ReactElement => {
    return <i className={`icon-${name} ${className}`} />;
};

export default Icon;
