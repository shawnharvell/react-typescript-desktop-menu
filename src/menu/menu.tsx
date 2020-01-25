import React, { useState, CSSProperties } from 'react';
import styles from './default-styles.css';

interface MenuProps {
    children: React.ReactNode;
    display?: boolean;
    style?: CSSProperties;
    label?: string | React.ReactNode;
    className?: string;
    action?: (tag: string, checked: boolean, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;

    menuItemStyle?: CSSProperties;
    menuItemIconStyle?: CSSProperties;
    menuItemDisabledStyle?: CSSProperties;
    menuItemInfoStyle?: CSSProperties;
    menuItemLabelStyle?: CSSProperties;
    menuItemArrowStyle?: CSSProperties;
    menuItemActiveStyle?: CSSProperties;
}

const Menu: React.FC<MenuProps> = ({ children, display, style, className, action, ...rest }) => {
    // todo what about bob? public static isReactDesktopMenu = true;

    const items: React.ReactNode[] = [];
    let delay = 0;
    // let ul: HTMLUListElement | null = null;

    const [itemActive, setItemActive] = useState(-1);
    const [submenuDisplay, setSubmenuDisplay] = useState(false);

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

    const setRef = (i: number, elmt: React.ReactNode): void => {
        items[i] = elmt;
    };

    const renderChildren = (): JSX.Element[] | null | undefined => {
        let index = -1;

        return React.Children.map<JSX.Element, React.ReactNode>(children, (child: React.ReactNode) => {
            // I know this looks a bit odd but functionally speaking it would never happen, there are just still
            // some holes in React's typescript awareness that this gets around
            if (!child || child === null) {
                return <React.Fragment />;
            } else if (!React.isValidElement(child)) {
                return <React.Fragment>{child}</React.Fragment>;
            }

            index++;

            const props = {
                active: index === itemActive,
                // ref: (): void => setRef(index, child),
                submenuDisplay: index === itemActive && submenuDisplay,
                onMouseOver: child.props.onMouseOver,
                action: child.props.action,
                style: { ...rest.menuItemStyle, ...child.props.style },
                iconStyle: { ...rest.menuItemIconStyle, ...child.props.iconStyle },
                disabledStyle: { ...rest.menuItemDisabledStyle, ...child.props.disabledStyle },
                infoStyle: { ...rest.menuItemInfoStyle, ...child.props.infoStyle },
                labelStyle: { ...rest.menuItemLabelStyle, ...child.props.labelStyle },
                arrowStyle: { ...rest.menuItemArrowStyle, ...child.props.arrowStyle },
                activeStyle: { ...rest.menuItemActiveStyle, ...child.props.activeStyle },
            };

            // const onMouseOver: (index: number) => void = (index) => handleMouseOver(index);

            if ('onMouseOver' in child.props) {
                const ownMouseOver = child.props.onMouseOver;
                props.onMouseOver = (e: any): void => {
                    ownMouseOver(e);
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

    const UNSAFE_componentWillUpdate = (nextProps: MenuProps): void => {
        if (!display && nextProps.display) {
            setItemActive(-1);
        }
    };

    delete rest.label;
    delete rest.menuItemActiveStyle;
    delete rest.menuItemArrowStyle;
    delete rest.menuItemDisabledStyle;
    delete rest.menuItemIconStyle;
    delete rest.menuItemInfoStyle;
    delete rest.menuItemLabelStyle;
    delete rest.menuItemStyle;

    if (!display) {
        return null;
    }

    return (
        <ul
            {...rest}
            className={styles['react-menu-bar-menu'] + ' react-menu-bar-menu ' + className}
            style={{ ...style }}
            // ref={(node): void => {
            //     ul = node;
            // }}
        >
            {renderChildren()}
        </ul>
    );
};

export default Menu;
