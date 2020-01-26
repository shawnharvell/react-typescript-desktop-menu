import React, { CSSProperties, useState, useRef, useEffect } from 'react';
import { MenuProps } from './menu';
import styles from './default-styles.css';

export interface MenuItemProps {
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
    const myself = useRef<HTMLLIElement>(null);

    const [checked, setChecked] = useState(defaultChecked);
    const [submenuPosition, setSubmenuPosition] = useState({ left: 0, top: 0 });
    const [submenuOffset, setSubmenuOffset] = useState({ height: 0, width: 0 });

    useEffect(() => {
        if (myself.current) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const dim = myself!.current!.getBoundingClientRect();
            let left = myself.current.offsetWidth + 8;
            let top = myself.current.offsetTop;

            if (dim.right + submenuOffset.width > window.innerWidth) {
                left = -submenuOffset.width;
            }
            if (dim.bottom + submenuOffset.height > window.innerHeight) {
                top = myself.current.offsetTop + myself.current.offsetHeight - submenuOffset.height;
            }
            setSubmenuPosition({ left, top });
        }
    }, [submenuDisplay]);

    const onOffsetChange = (height: number, width: number): void => {
        if (height !== submenuOffset.height || width !== submenuOffset.width) {
            setSubmenuOffset({ height, width });
        }
    };

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

    const getStyle = (): CSSProperties => {
        let stateStyle: CSSProperties = { ...rest.style };

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

    const createSubmenu = (child: React.ReactNode): React.ReactNode | null => {
        if (child && React.isValidElement(child)) {
            const props: MenuProps = {
                display: submenuDisplay,
                style: { position: 'absolute', ...child.props.style, ...submenuPosition },
                action: child.props.action,
                onOffsetChange: onOffsetChange,
                menuItemStyle: { ...rest.style, ...child.props.menuItemStyle },
                menuItemIconStyle: { ...rest.iconStyle, ...child.props.menuItemIconStyle },
                menuItemDisabledStyle: { ...rest.disabledStyle, ...child.props.menuItemDisabledStyle },
                menuItemInfoStyle: { ...rest.infoStyle, ...child.props.menuItemInfoStyle },
                menuItemLabelStyle: { ...rest.labelStyle, ...child.props.menuItemLabelStyle },
                menuItemArrowStyle: { ...rest.arrowStyle, ...child.props.menuItemArrowStyle },
                menuItemActiveStyle: { ...rest.activeStyle, ...child.props.menuItemActiveStyle },
                children: child.props.children,
            };

            if (!('action' in child.props) || !child.props.action) {
                props.action = action;
            }

            return React.cloneElement(child, props);
        } else {
            return null;
        }
    };

    const isMenuComponentForSubmenu = (child: React.ReactNode): boolean => {
        if (child && React.isValidElement(child)) {
            const childType = child['type'];
            if ((typeof childType === 'object' && childType !== null) || typeof childType === 'function') {
                return childType['name'] === 'Menu';
            }
        }
        return false;
    };

    const hasSubmenu = (): boolean => {
        return React.Children.toArray(children).some((child: React.ReactNode) => isMenuComponentForSubmenu(child));
    };

    const renderChildren = (): React.ReactNode[] | null | undefined => {
        return React.Children.map(children, (child: React.ReactNode) => {
            if (isMenuComponentForSubmenu(child)) {
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
            ref={myself}
            style={getStyle()}
            onMouseOver={handleMouseOver}
            onMouseOut={onMouseOut}
            onClick={!hasSubmenu() && action ? handleAction : undefined}
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
