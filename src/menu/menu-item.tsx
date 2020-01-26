import React, { CSSProperties, useState, useRef, useEffect } from 'react';
import { MenuProps } from './menu';
import { MenuStyles } from './shared';
import styles from './default-styles.module.css';

export interface MenuItemProps {
    icon?: string | React.ReactNode;
    info?: string | React.ReactNode;
    label?: string | React.ReactNode;
    disabled?: boolean;
    action?: (tag: string, checked: boolean, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    checkbox?: boolean;
    checked?: boolean;
    onSetChecked?: (checked: boolean) => void;
    shortcut?: string;

    children?: React.ReactNode;
    onMouseOver?: (e: React.MouseEvent) => void;
    onMouseOut?: (e: React.MouseEvent) => void;
    active?: boolean;
    submenuDisplay?: boolean;

    menuStyles?: MenuStyles;

    tag: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    info,
    label,
    disabled = false,
    action,
    checkbox = false,
    checked = false,
    onSetChecked,
    shortcut,
    children,
    onMouseOver,
    onMouseOut,
    active,
    submenuDisplay,
    tag,
    menuStyles,
}) => {
    const myself = useRef<HTMLLIElement>(null);

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
    }, [submenuDisplay, submenuOffset.height, submenuOffset.width]);

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

        const newCheckedValue = !checked;

        if (checkbox) {
            onSetChecked && onSetChecked(!checked);
        }

        action && action(tag || 'notagspecified', newCheckedValue, e);
    };

    const handleMouseOver = (e: React.MouseEvent): void => {
        onMouseOver && onMouseOver(e);
    };

    const handleMouseOut = (e: React.MouseEvent): void => {
        onMouseOut && onMouseOut(e);
    };

    const getStyle = (): CSSProperties => {
        let stateStyle: CSSProperties = { ...menuStyles?.menuitem?.listitem };

        if (active && !disabled) {
            stateStyle = { ...stateStyle, ...menuStyles?.menuitem?.active };
        } else if (disabled) {
            stateStyle = { ...stateStyle, ...menuStyles?.menuitem?.disabled };
        }

        return stateStyle;
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
                    ...menuStyles?.menuitem?.label,
                    ...label.props.style,
                },
            });
        } else if (typeof label === 'string') {
            if (shortcut) {
                const index = label.toLowerCase().indexOf(shortcut.toLowerCase());

                return (
                    <span className={className} style={menuStyles?.menuitem?.label}>
                        {label.slice(0, index)}
                        <u>{label.slice(index, index + 1)}</u>
                        {label.slice(index + 1)}
                    </span>
                );
            } else {
                return (
                    <span className={className} style={menuStyles?.menuitem?.label}>
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
                <span className={className} style={menuStyles?.menuitem?.icon}>
                    {checked ? '☑' : '☐'}
                </span>
            );
        } else if (typeof icon === 'string') {
            className += ' ' + icon;
            return <i className={className} style={menuStyles?.menuitem?.icon} />;
        } else if (React.isValidElement(icon)) {
            className += ' ' + icon.props.className;
            return React.cloneElement(icon, {
                className,
                style: {
                    ...menuStyles?.menuitem?.icon,
                    ...icon.props.style,
                },
            });
        } else {
            return <span className={className} style={menuStyles?.menuitem?.icon} />;
        }
    };

    const createInfo = (): JSX.Element | null => {
        const className = styles['react-menu-bar-menu-item-info'] + ' react-menu-bar-menu-item-info';

        if (React.isValidElement(info)) {
            return React.cloneElement(info, {
                className,
                style: {
                    ...menuStyles?.menuitem?.info,
                    ...info.props.style,
                },
            });
        } else if (typeof info === 'string') {
            return (
                <span className={className} style={menuStyles?.menuitem?.info}>
                    {info}
                </span>
            );
        } else {
            return null;
        }
    };

    const createSubmenu = (child: React.ReactNode): React.ReactNode | null => {
        if (child && React.isValidElement(child)) {
            const passStyles: MenuStyles = { ...menuStyles };
            passStyles.unorderedlist = { ...menuStyles?.unorderedlist, position: 'absolute', ...submenuPosition };
            const props: MenuProps = {
                display: submenuDisplay,
                action: child.props.action,
                onOffsetChange: onOffsetChange,
                menuStyles: passStyles,
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
                <span className={className} style={menuStyles?.menuitem?.arrow}>
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
            onMouseOut={handleMouseOut}
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
