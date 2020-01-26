import React, { CSSProperties, useState, useCallback, useRef, useEffect } from 'react';
import styles from './default-styles.css';
import useOnClickOutside from './use-on-click-outside';

interface MenubarProps {
    children: React.ReactNode;
    style?: CSSProperties;
    childStyle?: CSSProperties;
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

const Menubar: React.FC<MenubarProps> = ({ children, style, childStyle, action, onSetOpen, isOpen, ...rest }) => {
    const items: React.ReactNode[] = [];
    // let ul: HTMLUListElement | null = null;

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
            switch (e.key) {
                case 'Escape':
                    close();
                    break;

                default:
                    break;
            }
        },
        [close],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return (): void => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    // const setRef = (i: number, elmt: React.ReactNode): void => {
    //     items[i] = elmt;
    // };

    const renderChildren = (): JSX.Element[] | null | undefined => {
        return React.Children.map<JSX.Element, React.ReactNode>(children, (child: React.ReactNode, index: number) => {
            // I know this looks a bit odd but functionally speaking it would never happen, there are just still
            // some holes in React's typescript awareness that this gets around
            if (!child || child === null) {
                return <React.Fragment />;
            } else if (!React.isValidElement(child)) {
                return <React.Fragment>{child}</React.Fragment>;
            }

            items[index] = child;

            const active = menuActive === index;

            const props = {
                display: isOpen && active,
                // ref: (): void => setRef(index, child),
                style: { ...rest.menuStyle, ...child.props.style },
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

            if (!('action' in child.props) || !child.props.action) {
                props.action = action;
            }

            const menu = React.cloneElement(child, props);

            let className = styles['react-menu-bar-menu-bar-item'] + ' react-menu-bar-menu-bar-item ';
            if (active) {
                className += styles['react-menu-bar-menu-bar-item-active'] + ' react-menu-bar-menu-bar-item-active';
            }

            const style = { ...childStyle };

            return (
                <li
                    className={className}
                    style={style}
                    onMouseOver={(): void => handleMouseOver(index)}
                    tabIndex={index + 1}
                    data-ordinal={index}
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
        >
            {renderChildren()}
        </ul>
    );
};

export default Menubar;
