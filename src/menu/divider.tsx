import React, { CSSProperties } from 'react';
import styles from './default-styles.module.css';

export interface DividerProps {
    className?: string;
    style?: CSSProperties;
}

const Divider: React.FC<DividerProps> = ({ className, style }: DividerProps) => {
    const myClasses = styles['react-menu-bar-divider'] + ' react-menu-bar-divider ' + (className || '');
    return <li className={myClasses} style={style} />;
};

export default Divider;
