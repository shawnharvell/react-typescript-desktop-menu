import React, { CSSProperties, useState, useCallback, useRef, useEffect } from 'react';
import styles from './default-styles.css';
import useOnClickOutside from './use-on-click-outside';

interface MenubarProps {
    children: React.ReactNode;
    style?: CSSProperties;
    childStyle?: CSSProperties;
    keyboard?: boolean;
    action?: (tag: string, checked: boolean, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;

    onSetOpen: (open: boolean) => void;
    isOpen: boolean;

    menuStyle?: CSSProperties;

    menuItemStyle?: CSSProperties;
    menuItemIconStyle?: CSSProperties;
    menuItemDisabledStyle?: CSSProperties;
    menuItemDisabledActiveStyle?: CSSProperties;
    menuItemInfoStyle?: CSSProperties;
    menuItemLabelStyle?: CSSProperties;
    menuItemArrowStyle?: CSSProperties;
    menuItemActiveStyle?: CSSProperties;
}

interface MenubarState {
    showMenus: boolean;
    menuActive: number;
}

const Menubar: React.FC<MenubarProps> = ({
    children,
    style,
    childStyle,
    keyboard = true,
    action,
    onSetOpen,
    isOpen,
    ...rest
}) => {
    const items: any[] = [];
    let ul: HTMLUListElement | null = null;

    const [menuActive, setMenuActive] = useState(-1);

    const close = useCallback((): void => {
        setMenuActive(-1);
        onSetOpen && onSetOpen(false);
    }, [onSetOpen, setMenuActive]);

    const containerRef = useRef(null);

    const clickOutsideHandler = useCallback(() => {
        close();
    }, [close]);

    useOnClickOutside(containerRef, clickOutsideHandler);

    const handleMouseDown = (): void => {
        onSetOpen && onSetOpen(true);
    };

    const handleMouseOver = (i: number): void => {
        if (i !== menuActive) {
            setMenuActive(i);
        }
    };

    const handleMouseOut = (): void => {
        if (!isOpen) {
            setMenuActive(-1);
        }
    };

    const handleKeyDown = useCallback(
        (e: KeyboardEvent): void => {
            const length = React.Children.count(children);
            const current = menuActive;
            const currentElmt = items[current];
            const submenuDisplay = currentElmt && currentElmt.state.submenuDisplay;

            let newValue = null;

            switch (e.key) {
                case 'Escape':
                    if (!submenuDisplay) {
                        close();
                    }
                    break;

                case 'ArrowLeft':
                    if (submenuDisplay || !isOpen) {
                        return;
                    }

                    if (current === null || current - 1 < 0) {
                        newValue = length - 1;
                    } else {
                        newValue = current - 1;
                    }
                    break;

                case 'ArrowRight':
                    if (submenuDisplay || !isOpen) {
                        return;
                    }

                    if (current === null || current + 1 >= length) {
                        newValue = 0;
                    } else {
                        newValue = current + 1;
                    }
                    break;

                default:
                    break;
            }

            if (newValue !== null) {
                setMenuActive(newValue);
            }
        },
        [children, close, isOpen, items, menuActive],
    );

    useEffect(() => {
        if (keyboard) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return (): void => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [keyboard, handleKeyDown]);

    const setRef = (i: number, elmt: any): void => {
        items[i] = elmt;
    };

    const renderChildren = (): any[] | null | undefined => {
        return React.Children.map(children, (child: any, index: number) => {
            const active = menuActive === index;

            const props = {
                display: isOpen && active,
                ref: setRef.bind(index),
                style: { ...rest.menuStyle, ...child.props.style },
                keyboard: false,
                action: child.props.action,
                menuItemStyle: { ...rest.menuItemStyle, ...child.props.menuItemStyle },
                menuItemIconStyle: { ...rest.menuItemIconStyle, ...child.props.menuItemIconStyle },
                menuItemDisabledStyle: {
                    ...rest.menuItemDisabledStyle,
                    ...child.props.menuItemDisabledStyle,
                },
                menuItemInfoStyle: { ...rest.menuItemInfoStyle, ...child.props.menuItemInfoStyle },
                menuItemLabelStyle: { ...rest.menuItemLabelStyle, ...child.props.menuItemLabelStyle },
                menuItemArrowStyle: { ...rest.menuItemArrowStyle, ...child.props.menuItemArrowStyle },
                menuItemActiveStyle: { ...rest.menuItemActiveStyle, ...child.props.menuItemActiveStyle },
            };

            if (!('keyboard' in child.props)) {
                props.keyboard = keyboard || false;
            }

            if (!('action' in child.props) || !child.props.action) {
                props.action = action;
            }

            const menu = React.cloneElement(child, props);

            let className = styles['react-menu-bar-menu-bar-item'] + ' react-menu-bar-menu-bar-item ';
            if (active) {
                // TODO: do I need this?
                className += styles['react-menu-bar-menu-bar-item-active'] + ' react-menu-bar-menu-bar-item-active';
            }

            const style = { ...childStyle };

            return (
                <li
                    className={className}
                    style={style}
                    onMouseOver={(): void => handleMouseOver(index)}
                    tabIndex={index + 1}
                >
                    {child.props.label}
                    <br />
                    {menu}
                </li>
            );
        });
    };

    return (
        <ul
            {...rest}
            className={styles['react-menu-bar-menu-bar-container'] + ' react-menu-bar-menu-bar-container'}
            style={{ ...style }}
            onMouseDown={handleMouseDown}
            onMouseOut={handleMouseOut}
            ref={(node): void => {
                ul = node;
            }}
        >
            {renderChildren()}
        </ul>
    );
};

export default Menubar;
