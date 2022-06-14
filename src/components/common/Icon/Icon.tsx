import React from 'react';

interface Icon {
    children: string;
    className: string;
}

const Icon = ({ children, className }: Icon): React.ReactElement => {
    return <i className={`icon-${children} ${className}`}></i>;
};

export default Icon;
