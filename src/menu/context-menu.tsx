import React, { useRef, useCallback, useEffect } from 'react';
import styles from './default-styles.css';
import useContextMenu from './use-context-menu';
import useOnClickOutside from './use-on-click-outside';
import { MenuStyles } from './shared';

export interface ContextMenuProps {
    children: React.ReactNode;
    menu: React.ReactNode;
    outerRef: React.MutableRefObject<null>;
    onSetOpen: (open: boolean) => void;
    isOpen: boolean;
    menuStyles?: MenuStyles;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ children, menu, outerRef, onSetOpen, isOpen, menuStyles }) => {
    const { xPos, yPos } = useContextMenu(outerRef, onSetOpen);

    const containerRef = useRef(null);

    const clickOutsideHandler = useCallback(() => {
        onSetOpen && onSetOpen(false);
    }, [onSetOpen]);

    useOnClickOutside(containerRef, clickOutsideHandler);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent): void => {
            switch (e.key) {
                case 'Escape':
                    clickOutsideHandler();
                    break;

                default:
                    break;
            }
        },
        [clickOutsideHandler],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return (): void => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

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
