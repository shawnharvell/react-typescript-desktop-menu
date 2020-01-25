import React, { useRef, useCallback } from 'react';
import styles from './default-styles.css';
import useContextMenu from './use-context-menu';
import useOnClickOutside from './use-on-click-outside';

export interface ContextMenuProps {
    children: React.ReactNode;
    menu: React.ReactNode;
    outerRef: React.MutableRefObject<null>;
    onSetOpen: (open: boolean) => void;
    isOpen: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ children, menu, outerRef, onSetOpen, isOpen }) => {
    const { xPos, yPos } = useContextMenu(outerRef, onSetOpen);

    const containerRef = useRef(null);

    const clickOutsideHandler = useCallback(() => {
        onSetOpen && onSetOpen(false);
    }, [onSetOpen]);

    useOnClickOutside(containerRef, clickOutsideHandler);

    const content = React.Children.only(children);

    const className = styles['react-menu-bar-context-menu'] + ' react-menu-bar-context-menu';
    // todo experiment with turning off css prop visibility or the like rather than not rendering
    // at all when not open, that may per better since I think it wouldn't trigger re-render
    const menuContainer = isOpen ? (
        <div
            key="contextMenu"
            className={className}
            ref={containerRef}
            style={{
                position: 'fixed',
                left: xPos,
                top: yPos,
                zIndex: 100000,
            }}
        >
            {menu}
        </div>
    ) : null;

    return (
        <React.Fragment>
            {content}
            {menuContainer}
        </React.Fragment>
    );
};

export default ContextMenu;
