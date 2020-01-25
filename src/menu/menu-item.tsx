import React, { CSSProperties } from 'react';
import PropTypes from 'prop-types';
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

class MenuItem extends React.Component<MenuItemProps, MenuItemState> {
    public static propTypes = {
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        info: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        disabled: PropTypes.bool,
        action: PropTypes.func,
        checkbox: PropTypes.bool,
        defaultChecked: PropTypes.bool,
        shortcut: PropTypes.string,

        style: PropTypes.object,
        iconStyle: PropTypes.object,
        disabledStyle: PropTypes.object,
        disabledActiveStyle: PropTypes.object,
        infoStyle: PropTypes.object,
        labelStyle: PropTypes.object,
        arrowStyle: PropTypes.object,
        activeStyle: PropTypes.object,
        children: PropTypes.node,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func,
        active: PropTypes.bool,
        submenuDisplay: PropTypes.bool,

        tag: PropTypes.string.isRequired,
    };

    public static defaultProps = {
        disabled: false,
        submenuDisplay: false,
        checked: false,
    };

    public static isReactDesktopMenuItem = true;

    public submenu: any;
    private node: any;

    constructor(props: MenuItemProps) {
        super(props);

        this.handleAction = this.handleAction.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);

        this.state = {
            checked: false,
            submenuPosition: { left: 0, top: 0 },
        };
    }

    public handleAction(e: React.MouseEvent<HTMLLIElement, MouseEvent>): void {
        e.preventDefault();

        if (this.props.disabled) {
            return;
        }

        this.setState({ checked: !this.state.checked });

        if (this.props.action) {
            this.props.action(this.props.tag || 'notagspecified', !this.state.checked, e);
        }
    }

    public handleMouseOver(e: React.MouseEvent): void {
        if (this.props.onMouseOver) {
            this.props.onMouseOver(e);
        }
    }

    public getStyle(): any {
        const { active, disabled, style, activeStyle, disabledStyle } = this.props;

        let stateStyle: any = { ...style };

        if (active && !disabled) {
            stateStyle = { ...stateStyle, ...activeStyle };
        } else if (disabled) {
            stateStyle = { ...stateStyle, ...disabledStyle };
        }

        return { ...stateStyle, ...style };
    }

    public getClassnames(): string {
        const { active, disabled } = this.props;

        let classNames = styles['react-menu-bar-menu-item-container'] + ' react-menu-bar-menu-item-container ';

        if (active && !disabled) {
            classNames +=
                styles['react-menu-bar-menu-item-container-active'] + ' react-menu-bar-menu-item-container-active ';
        } else if (disabled) {
            classNames +=
                styles['react-menu-bar-menu-item-container-disabled'] + ' react-menu-bar-menu-item-container-disabled ';
        }

        return classNames;
    }

    public createLabel(): JSX.Element | null {
        const { shortcut, label } = this.props;
        const className = styles['react-menu-bar-menu-item-label'] + ' react-menu-bar-menu-item-label';

        if (React.isValidElement(label)) {
            return React.cloneElement(label, {
                className,
                style: {
                    ...this.props.labelStyle,
                    ...label.props.style,
                },
            });
        } else if (typeof label === 'string') {
            if (shortcut) {
                const index = label.toLowerCase().indexOf(shortcut.toLowerCase());

                return (
                    <span className={className} style={this.props.labelStyle}>
                        {label.slice(0, index)}
                        <u>{label.slice(index, index + 1)}</u>
                        {label.slice(index + 1)}
                    </span>
                );
            } else {
                return (
                    <span className={className} style={this.props.labelStyle}>
                        {label}
                    </span>
                );
            }
        } else {
            return null;
        }
    }

    public createIcon(): JSX.Element {
        const { icon, checkbox } = this.props;
        const { checked } = this.state;
        let className = styles['react-menu-bar-menu-item-icon'] + ' react-menu-bar-menu-item-icon';

        if (checkbox) {
            className += styles['react-menu-bar-menu-item-checkbox'] + ' react-menu-bar-menu-item-checkbox';
            return (
                <span className={className} style={this.props.iconStyle}>
                    {checked ? '☑' : '☐'}
                </span>
            );
        } else if (typeof icon === 'string') {
            className += ' ' + icon;
            return <i className={className} style={this.props.iconStyle} />;
        } else if (React.isValidElement(icon)) {
            className += ' ' + icon.props.className;
            return React.cloneElement(icon, {
                className,
                style: {
                    ...this.props.iconStyle,
                    ...icon.props.style,
                },
            });
        } else {
            return <span className={className} style={this.props.iconStyle} />;
        }
    }

    public createInfo(): JSX.Element | null {
        const { info } = this.props;
        const className = styles['react-menu-bar-menu-item-info'] + ' react-menu-bar-menu-item-info';

        if (React.isValidElement(info)) {
            return React.cloneElement(info, {
                className,
                style: {
                    ...this.props.infoStyle,
                    ...info.props.style,
                },
            });
        } else if (typeof info === 'string') {
            return (
                <span className={className} style={this.props.infoStyle}>
                    {info}
                </span>
            );
        } else {
            return null;
        }
    }

    public createSubmenu(child: any): any {
        const props = {
            display: this.props.submenuDisplay,
            style: { position: 'absolute', ...child.props.style, ...this.state.submenuPosition },
            ref: (node: any): void => {
                this.submenu = node;
            },
            action: child.props.action,
            menuItemStyle: { ...this.props.style, ...child.props.menuItemStyle },
            menuItemIconStyle: { ...this.props.iconStyle, ...child.props.menuItemIconStyle },
            menuItemDisabledStyle: { ...this.props.disabledStyle, ...child.props.menuItemDisabledStyle },
            menuItemInfoStyle: { ...this.props.infoStyle, ...child.props.menuItemInfoStyle },
            menuItemLabelStyle: { ...this.props.labelStyle, ...child.props.menuItemLabelStyle },
            menuItemArrowStyle: { ...this.props.arrowStyle, ...child.props.menuItemArrowStyle },
            menuItemActiveStyle: { ...this.props.activeStyle, ...child.props.menuItemActiveStyle },
        };

        if (!('action' in child.props) || !child.props.action) {
            props.action = this.props.action;
        }

        return React.cloneElement(child, props);
    }

    public hasSubmenu(): boolean {
        return React.Children.toArray(this.props.children).some(
            (child: any) => child.type && child.type.isReactDesktopMenu,
        );
    }

    public componentDidUpdate(prevProps: MenuItemProps): void {
        if (this.props.submenuDisplay && !prevProps.submenuDisplay) {
            this.setSubmenuPosition();
        }
    }

    public UNSAFE_componentWillMount(): void {
        this.setState({ checked: this.props.defaultChecked || false });
    }

    public setSubmenuPosition(): void {
        const { node } = this;
        const dim = node.getBoundingClientRect();
        const subNode = this.submenu.node;

        if (!subNode) {
            return;
        }

        let left = node.offsetWidth;
        let top = node.offsetTop;

        if (dim.right + subNode.offsetWidth > window.innerWidth) {
            left = -subNode.offsetWidth;
        }

        if (dim.bottom + subNode.offsetHeight > window.innerHeight) {
            top = node.offsetTop + node.offsetHeight - subNode.offsetHeight;
        }

        this.setState({ submenuPosition: { left, top } });
    }

    public renderChildren(): any[] | null | undefined {
        return React.Children.map(this.props.children, (child: any) => {
            if (child.type && child.type.isReactDesktopMenu) {
                return this.createSubmenu(child);
            } else {
                return child;
            }
        });
    }

    public renderSubmenu(): JSX.Element | null {
        if (this.hasSubmenu()) {
            const className =
                styles['react-menu-bar-menu-item-submenu-arrow'] + ' react-menu-bar-menu-item-submenu-arrow';
            return (
                <span className={className} style={this.props.arrowStyle}>
                    &#9656;
                </span>
            );
        } else {
            return null;
        }
    }

    public render(): JSX.Element {
        const { action, ...rest } = this.props;

        for (const n of Object.keys(MenuItem.propTypes)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            delete rest[n];
        }

        return (
            <li
                {...rest}
                className={this.getClassnames()}
                style={this.getStyle()}
                onMouseOver={this.handleMouseOver}
                onClick={!this.hasSubmenu() && action ? this.handleAction : undefined}
                ref={(node): void => {
                    this.node = node;
                }}
            >
                {this.createIcon()}
                {this.createLabel()}
                {this.renderChildren()}
                {this.createInfo()}
                {this.renderSubmenu()}
            </li>
        );
    }
}

export default MenuItem;
