import React from 'react';
import styles from './default-styles.module.css';

interface DividerProps {
    className?: string;
}

const Divider: React.FC<DividerProps> = ({ className }: DividerProps) => {
    const myClasses = styles['react-menu-bar-divider'] + ' react-menu-bar-divider ' + (className || '');
    return <li className={myClasses} />;
};

export default Divider;
