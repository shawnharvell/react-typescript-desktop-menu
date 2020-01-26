import React, { useState, CSSProperties, useEffect } from 'react';
import { MenuItemProps } from './menu-item';
import styles from './default-styles.css';
import { MenuStyles } from './shared';

export interface MenuProps {
    children: React.ReactNode;
    display?: boolean;
    style?: CSSProperties;
    label?: string | React.ReactNode;
    className?: string;
    action?: (tag: string, checked: boolean, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    onOffsetChange?: (height: number, width: number) => void;

    menuStyles?: MenuStyles;
}

const Menu: React.FC<MenuProps> = ({ children, display, style, className, action, onOffsetChange, menuStyles }) => {
    const items: React.ReactNode[] = [];
    let delay = 0;

    const [itemActive, setItemActive] = useState(-1);
    const [submenuDisplay, setSubmenuDisplay] = useState(false);

    useEffect(() => {
        if (!display) {
            setItemActive(-1);
        }
    }, [display]);

    const handleMouseOver = (i: number): void => {
        if (i !== itemActive) {
            if (delay) {
                window.clearTimeout(delay);
            }

            setItemActive(i);
            setSubmenuDisplay(false);

            const currentElmt = items[i];

            //if (currentElmt && currentElmt.hasSubmenu && currentElmt.hasSubmenu()) {
            if (currentElmt) {
                delay = window.setTimeout(() => setSubmenuDisplay(true), 300);
            }
        }
    };

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

            const props: MenuItemProps = {
                active: index === itemActive,
                submenuDisplay: index === itemActive && submenuDisplay,
                onMouseOver: child.props.onMouseOver,
                action: child.props.action,
                tag: child.props.tag,
                menuStyles: { ...menuStyles, ...child.props.menuStyles },
            };

            if ('onMouseOver' in child.props) {
                const ownMouseOver = child.props.onMouseOver;
                props.onMouseOver = (e: React.MouseEvent<Element, MouseEvent>): void => {
                    ownMouseOver && ownMouseOver(e);
                    handleMouseOver(index);
                };
            } else {
                props.onMouseOver = (): void => handleMouseOver(index);
            }

            if (!('action' in child.props) || !child.props.action) {
                props.action = action;
            }

            return React.cloneElement(child, props);
        });
    };

    if (!display) {
        return null;
    }

    return (
        <ul
            className={styles['react-menu-bar-menu'] + ' react-menu-bar-menu ' + className}
            style={{ ...style }}
            ref={(node): void => {
                if (onOffsetChange && node) {
                    onOffsetChange(node.offsetHeight, node.offsetWidth);
                }
            }}
        >
            {renderChildren()}
        </ul>
    );
};

export default Menu;
