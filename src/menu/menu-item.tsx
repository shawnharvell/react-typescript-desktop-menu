import React, { CSSProperties, useState } from 'react';
import styles from './default-styles.css';

interface MenuItemProps {
    icon?: string | React.ReactNode;
    info?: string | React.ReactNode;
    label?: string | React.ReactNode;
    disabled?: boolean;
    action?: (tag: string, checked: boolean, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    checkbox?: boolean;
    defaultChecked?: boolean;
    shortcut?: string;

    style?: CSSProperties;
    iconStyle?: CSSProperties;
    disabledStyle?: CSSProperties;
    infoStyle?: CSSProperties;
    labelStyle?: CSSProperties;
    arrowStyle?: CSSProperties;
    activeStyle?: CSSProperties;
    children?: React.ReactNode;
    onMouseOver?: (e: React.MouseEvent) => void;
    onMouseOut?: (e: React.MouseEvent) => void;
    active?: boolean;
    submenuDisplay?: boolean;

    tag: string;
}

interface MenuItemState {
    checked: boolean;
    submenuPosition: {
        left: number;
        top: number;
    };
}

const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    info,
    label,
    disabled = false,
    action,
    checkbox = false,
    defaultChecked = false,
    shortcut,
    children,
    onMouseOver,
    onMouseOut,
    active,
    submenuDisplay,
    tag,
    ...rest
}) => {
    // todo another pair of bobs
    // public static defaultProps = {
    //     disabled: false,
    //     submenuDisplay: false,
    //     checked: false,
    // };

    //let submenu: any;
    //let li: any;

    const [checked, setChecked] = useState(defaultChecked);
    const [submenuPosition, setSubmenuPosition] = useState({ left: 0, top: 0 });

    const handleAction = (e: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
        e.preventDefault();

        if (disabled) {
            return;
        }

        setChecked(!checked);

        action && action(tag || 'notagspecified', !checked, e);
    };

    const handleMouseOver = (e: React.MouseEvent): void => {
        onMouseOver && onMouseOver(e);
    };

    const getStyle = (): any => {
        let stateStyle: any = { ...rest.style };

        if (active && !disabled) {
            stateStyle = { ...stateStyle, ...rest.activeStyle };
        } else if (disabled) {
            stateStyle = { ...stateStyle, ...rest.disabledStyle };
        }

        return { ...stateStyle, ...rest.style };
    };

    const getClassnames = (): string => {
        let classNames = styles['react-menu-bar-menu-item-container'] + ' react-menu-bar-menu-item-container ';

        if (active && !disabled) {
            classNames +=
                styles['react-menu-bar-menu-item-container-active'] + ' react-menu-bar-menu-item-container-active ';
        } else if (disabled) {
            classNames +=
                styles['react-menu-bar-menu-item-container-disabled'] + ' react-menu-bar-menu-item-container-disabled ';
        }

        return classNames;
    };

    const createLabel = (): JSX.Element | null => {
        const className = styles['react-menu-bar-menu-item-label'] + ' react-menu-bar-menu-item-label';

        if (React.isValidElement(label)) {
            return React.cloneElement(label, {
                className,
                style: {
                    ...rest.labelStyle,
                    ...label.props.style,
                },
            });
        } else if (typeof label === 'string') {
            if (shortcut) {
                const index = label.toLowerCase().indexOf(shortcut.toLowerCase());

                return (
                    <span className={className} style={rest.labelStyle}>
                        {label.slice(0, index)}
                        <u>{label.slice(index, index + 1)}</u>
                        {label.slice(index + 1)}
                    </span>
                );
            } else {
                return (
                    <span className={className} style={rest.labelStyle}>
                        {label}
                    </span>
                );
            }
        } else {
            return null;
        }
    };

    const createIcon = (): JSX.Element => {
        let className = styles['react-menu-bar-menu-item-icon'] + ' react-menu-bar-menu-item-icon';

        if (checkbox) {
            className += styles['react-menu-bar-menu-item-checkbox'] + ' react-menu-bar-menu-item-checkbox';
            return (
                <span className={className} style={rest.iconStyle}>
                    {checked ? '☑' : '☐'}
                </span>
            );
        } else if (typeof icon === 'string') {
            className += ' ' + icon;
            return <i className={className} style={rest.iconStyle} />;
        } else if (React.isValidElement(icon)) {
            className += ' ' + icon.props.className;
            return React.cloneElement(icon, {
                className,
                style: {
                    ...rest.iconStyle,
                    ...icon.props.style,
                },
            });
        } else {
            return <span className={className} style={rest.iconStyle} />;
        }
    };

    const createInfo = (): JSX.Element | null => {
        const className = styles['react-menu-bar-menu-item-info'] + ' react-menu-bar-menu-item-info';

        if (React.isValidElement(info)) {
            return React.cloneElement(info, {
                className,
                style: {
                    ...rest.infoStyle,
                    ...info.props.style,
                },
            });
        } else if (typeof info === 'string') {
            return (
                <span className={className} style={rest.infoStyle}>
                    {info}
                </span>
            );
        } else {
            return null;
        }
    };

    const createSubmenu = (child: any): any => {
        const props = {
            display: submenuDisplay,
            style: { position: 'absolute', ...child.props.style, ...submenuPosition },
            // ref: (node: any): void => {
            //     submenu = node;
            // },
            action: child.props.action,
            menuItemStyle: { ...rest.style, ...child.props.menuItemStyle },
            menuItemIconStyle: { ...rest.iconStyle, ...child.props.menuItemIconStyle },
            menuItemDisabledStyle: { ...rest.disabledStyle, ...child.props.menuItemDisabledStyle },
            menuItemInfoStyle: { ...rest.infoStyle, ...child.props.menuItemInfoStyle },
            menuItemLabelStyle: { ...rest.labelStyle, ...child.props.menuItemLabelStyle },
            menuItemArrowStyle: { ...rest.arrowStyle, ...child.props.menuItemArrowStyle },
            menuItemActiveStyle: { ...rest.activeStyle, ...child.props.menuItemActiveStyle },
        };

        if (!('action' in child.props) || !child.props.action) {
            props.action = action;
        }

        return React.cloneElement(child, props);
    };

    const hasSubmenu = (): boolean => {
        return React.Children.toArray(children).some((child: any) => child.type && child.type.name === 'Menu');
    };

    const componentDidUpdate = (prevProps: MenuItemProps): void => {
        if (submenuDisplay && !prevProps.submenuDisplay) {
            calculateAndSetSubmenuPosition();
        }
    };

    const calculateAndSetSubmenuPosition = (): void => {
        // const { node } = this;
        // const dim = node.getBoundingClientRect();
        // const subNode = submenu.node;
        // if (!subNode) {
        //     return;
        // }
        // let left = node.offsetWidth;
        // let top = node.offsetTop;
        // if (dim.right + subNode.offsetWidth > window.innerWidth) {
        //     left = -subNode.offsetWidth;
        // }
        // if (dim.bottom + subNode.offsetHeight > window.innerHeight) {
        //     top = node.offsetTop + node.offsetHeight - subNode.offsetHeight;
        // }
        // setSubmenuPosition({ left, top });
    };

    const renderChildren = (): any[] | null | undefined => {
        return React.Children.map(children, (child: any) => {
            if (child.type && child.type.name === 'Menu') {
                return createSubmenu(child);
            } else {
                return child;
            }
        });
    };

    const renderSubmenu = (): JSX.Element | null => {
        if (hasSubmenu()) {
            const className =
                styles['react-menu-bar-menu-item-submenu-arrow'] + ' react-menu-bar-menu-item-submenu-arrow';
            return (
                <span className={className} style={rest.arrowStyle}>
                    &#9656;
                </span>
            );
        } else {
            return null;
        }
    };

    return (
        <li
            className={getClassnames()}
            style={getStyle()}
            onMouseOver={handleMouseOver}
            onClick={!hasSubmenu() && action ? handleAction : undefined}
            // ref={(node): void => {
            //     li = node;
            // }}
        >
            {createIcon()}
            {createLabel()}
            {renderChildren()}
            {createInfo()}
            {renderSubmenu()}
        </li>
    );
};

export default MenuItem;
