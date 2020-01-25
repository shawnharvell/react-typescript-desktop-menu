import React, { Component, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import MenuItem from './menu-item';
import styles from './default-styles.css';

interface MenuProps {
    children: React.ReactNode;
    display?: boolean;
    style?: CSSProperties;
    label?: string | React.ReactNode;
    keyboard?: boolean;
    className?: string;
    action?: (tag: string, checked: boolean, event: any) => void;

    menuItemStyle?: CSSProperties;
    menuItemIconStyle?: CSSProperties;
    menuItemDisabledStyle?: CSSProperties;
    menuItemInfoStyle?: CSSProperties;
    menuItemLabelStyle?: CSSProperties;
    menuItemArrowStyle?: CSSProperties;
    menuItemActiveStyle?: CSSProperties;
}

interface MenuState {
    itemActive: number;
    submenuDisplay: boolean;
}

class Menu extends Component<MenuProps, MenuState> {
    public static propTypes = {
        children: PropTypes.node,
        display: PropTypes.bool,
        style: PropTypes.object,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        itemHoverColor: PropTypes.string,
        keyboard: PropTypes.bool,
    };

    public static defaultProps = { display: true };

    public static isReactDesktopMenu = true;

    private items: MenuItem[];
    private delay = 0;
    private node: HTMLUListElement | null = null;

    constructor(props: MenuProps) {
        super(props);

        this.state = { itemActive: -1, submenuDisplay: false };

        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.items = [];
    }

    public handleMouseOver(i: number): void {
        if (i !== this.state.itemActive) {
            if (this.delay) {
                window.clearTimeout(this.delay);
            }

            this.setState({ itemActive: i, submenuDisplay: false });

            const currentElmt = this.items[i];

            if (currentElmt && currentElmt.hasSubmenu && currentElmt.hasSubmenu()) {
                this.delay = window.setTimeout(() => this.setState({ submenuDisplay: true }), 300);
            }
        }
    }

    public handleKeyDown(e: any): void {
        if (!this.props.display) {
            return;
        }

        const length = React.Children.count(this.props.children);
        const current = this.state.itemActive;
        const { submenuDisplay } = this.state;
        const currentElmt = this.items[current];
        const submenu = currentElmt && currentElmt.submenu;

        let newValue = null;

        switch (e.key) {
            case 'ArrowDown':
                if (submenuDisplay) {
                    return;
                }

                e.preventDefault();

                if (current === null || current + 1 >= length) {
                    newValue = 0;
                } else {
                    newValue = current + 1;
                }
                break;

            case 'ArrowUp':
                if (submenuDisplay) {
                    return;
                }

                e.preventDefault();

                if (current === null || current - 1 < 0) {
                    newValue = length - 1;
                } else {
                    newValue = current - 1;
                }
                break;

            case 'ArrowLeft':
            case 'Escape':
                if (submenuDisplay && (!submenu || !submenu.state.submenuDisplay)) {
                    e.preventDefault();

                    window.setTimeout(() => this.setState({ submenuDisplay: false }), 0);
                }
                break;

            case 'ArrowRight':
                if (submenu && !submenuDisplay) {
                    e.preventDefault();
                    this.setState({ submenuDisplay: true });
                } else if (!submenuDisplay && current === -1) {
                    e.preventDefault();
                    newValue = 0;
                }
                break;

            case 'Enter':
                if (!submenuDisplay) {
                    if (submenu) {
                        e.preventDefault();
                        this.setState({ submenuDisplay: true });
                    } else if (currentElmt && currentElmt.handleAction) {
                        e.preventDefault();
                        currentElmt.handleAction(e);
                    }
                }
                break;

            default:
                if (!submenuDisplay) {
                    const index = this.items.findIndex(item => item.props.shortcut === e.key);

                    if (index !== -1) {
                        e.preventDefault();
                        newValue = index;
                        if (this.items[index].handleAction) {
                            this.items[index].handleAction(e);
                        }
                    }
                }

                break;
        }

        if (newValue !== null) {
            this.setState({ itemActive: newValue });
        }
    }

    public setRef(i: number, elmt: any): void {
        this.items[i] = elmt;
    }

    public renderChildren(): any[] | null | undefined {
        let index = -1;

        return React.Children.map(this.props.children, (child: any) => {
            if (child.type && child.type.isReactDesktopMenuItem) {
                index++;

                const props = {
                    active: index === this.state.itemActive,
                    ref: this.setRef.bind(this, index),
                    submenuDisplay: index === this.state.itemActive && this.state.submenuDisplay,
                    onMouseOver: child.props.onMouseOver,
                    keyboard: false,
                    action: child.props.action,
                    style: { ...this.props.menuItemStyle, ...child.props.style },
                    iconStyle: { ...this.props.menuItemIconStyle, ...child.props.iconStyle },
                    disabledStyle: { ...this.props.menuItemDisabledStyle, ...child.props.disabledStyle },
                    infoStyle: { ...this.props.menuItemInfoStyle, ...child.props.infoStyle },
                    labelStyle: { ...this.props.menuItemLabelStyle, ...child.props.labelStyle },
                    arrowStyle: { ...this.props.menuItemArrowStyle, ...child.props.arrowStyle },
                    activeStyle: { ...this.props.menuItemActiveStyle, ...child.props.activeStyle },
                };

                const onMouseOver: (index: number) => void = this.handleMouseOver.bind(this, index);

                if ('onMouseOver' in child.props) {
                    const ownMouseOver = child.props.onMouseOver;

                    props.onMouseOver = (e: any): void => {
                        ownMouseOver(e);
                        onMouseOver(e);
                    };
                } else {
                    props.onMouseOver = onMouseOver;
                }

                if (!('keyboard' in child.props)) {
                    props.keyboard = this.props.keyboard || false;
                }

                if (!('action' in child.props) || !child.props.action) {
                    props.action = this.props.action;
                }

                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    public addKeyboardListener(): void {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public removeKeyboardListener(): void {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    public componentDidMount(): void {
        if (this.props.keyboard) {
            this.addKeyboardListener();
        }
    }

    public componentWillUnmount(): void {
        this.removeKeyboardListener();
    }

    public componentDidUpdate(prevProps: MenuProps): void {
        if (prevProps.keyboard && !this.props.keyboard) {
            this.removeKeyboardListener();
        } else if (!prevProps.keyboard && this.props.keyboard) {
            this.addKeyboardListener();
        }
    }

    public UNSAFE_componentWillUpdate(nextProps: MenuProps): void {
        if (!this.props.display && nextProps.display) {
            this.setState({ itemActive: -1 });
        }
    }

    public render(): JSX.Element | null {
        const { display, style, ...rest } = this.props;
        const className = styles['react-menu-bar-menu'] + ' react-menu-bar-menu ' + this.props.className;

        delete rest.children;
        delete rest.label;
        delete rest.keyboard;
        delete rest.action;
        delete rest.className;
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
                className={className}
                style={{ ...style }}
                ref={(node): void => {
                    this.node = node;
                }}
            >
                {this.renderChildren()}
            </ul>
        );
    }
}

export default Menu;
