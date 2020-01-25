import React from 'react';
import styles from './default-styles.css';

interface DividerProps {
    className?: string;
}

const Divider: React.FC<DividerProps> = ({ className, ...rest }: DividerProps) => {
    const myClasses = styles['react-menu-bar-divider'] + ' react-menu-bar-divider ' + (className || '');
    return <li className={myClasses} {...rest} />;
};

export default Divider;
