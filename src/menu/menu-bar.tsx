/* eslint react/jsx-no-bind:0 */

import React, { Component, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import styles from './default-styles.css';

interface MenubarProps {
    children: React.ReactNode;
    style?: CSSProperties;
    childStyle?: CSSProperties;
    keyboard?: boolean;
    action?: (tag: string, checked: boolean, event: any) => void;

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

class Menubar extends Component<MenubarProps, MenubarState> {
    public static propTypes = {
        children: PropTypes.node,
        style: PropTypes.object,
        childStyle: PropTypes.object,
        keyboard: PropTypes.bool,

        menuStyle: PropTypes.object,

        menuItemStyle: PropTypes.object,
        menuItemIconStyle: PropTypes.object,
        menuItemDisabledStyle: PropTypes.object,
        menuItemDisabledActiveStyle: PropTypes.object,
        menuItemInfoStyle: PropTypes.object,
        menuItemLabelStyle: PropTypes.object,
        menuItemArrowStyle: PropTypes.object,
        menuItemActiveStyle: PropTypes.object,
    };

    public static defaultProps = {
        keyboard: true,
    };

    private items: any[];
    private ul: HTMLUListElement | null = null;

    constructor(props: MenubarProps) {
        super(props);

        this.state = {
            showMenus: false,
            menuActive: -1,
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleClickDoc = this.handleClickDoc.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);

        this.items = [];
    }

    public close(): void {
        this.setState({ showMenus: false, menuActive: -1 });
    }

    public handleMouseDown(): void {
        this.setState({ showMenus: true });
    }

    public handleMouseOver(i: number): void {
        if (i !== this.state.menuActive) {
            this.setState({ menuActive: i });
        }
    }

    public handleMouseOut(): void {
        if (!this.state.showMenus) {
            this.setState({ menuActive: -1 });
        }
    }

    public handleClickDoc(e: any): void {
        if (this.ul && !this.ul.contains(e.target)) {
            this.close();
        }
    }

    public handleKeyDown(e: any): void {
        const length = React.Children.count(this.props.children);
        const current = this.state.menuActive;
        const currentElmt = this.items[current];
        const submenuDisplay = currentElmt && currentElmt.state.submenuDisplay;

        let newValue = null;

        switch (e.key) {
            case 'Escape':
                if (!submenuDisplay) {
                    this.setState({ showMenus: false, menuActive: -1 });
                }
                break;

            case 'ArrowLeft':
                if (submenuDisplay || !this.state.showMenus) {
                    return;
                }

                if (current === null || current - 1 < 0) {
                    newValue = length - 1;
                } else {
                    newValue = current - 1;
                }
                break;

            case 'ArrowRight':
                if (submenuDisplay || !this.state.showMenus) {
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
            this.setState({ menuActive: newValue });
        }
    }

    public addKeyboardListener(): void {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public removeKeyboardListener(): void {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    public componentDidMount(): void {
        document.addEventListener('click', this.handleClickDoc);
        if (this.props.keyboard) {
            this.addKeyboardListener();
        }
    }

    public componentWillUnmount(): void {
        document.removeEventListener('click', this.handleClickDoc);
        this.removeKeyboardListener();
    }

    public componentDidUpdate(prevProps: MenubarProps): void {
        if (prevProps.keyboard && !this.props.keyboard) {
            this.removeKeyboardListener();
        } else if (!prevProps.keyboard && this.props.keyboard) {
            this.addKeyboardListener();
        }
    }

    public setRef(i: number, elmt: any): void {
        this.items[i] = elmt;
    }

    public renderChildren(): any[] | null | undefined {
        let index = -1;

        return React.Children.map(this.props.children, (child: any, i: number) => {
            if (child.type && child.type.isReactDesktopMenu) {
                index++;

                const active = this.state.menuActive === i;

                const props = {
                    display: this.state.showMenus && active,
                    ref: this.setRef.bind(this, index),
                    style: { ...this.props.menuStyle, ...child.props.style },
                    keyboard: false,
                    action: child.props.action,
                    menuItemStyle: { ...this.props.menuItemStyle, ...child.props.menuItemStyle },
                    menuItemIconStyle: { ...this.props.menuItemIconStyle, ...child.props.menuItemIconStyle },
                    menuItemDisabledStyle: {
                        ...this.props.menuItemDisabledStyle,
                        ...child.props.menuItemDisabledStyle,
                    },
                    menuItemInfoStyle: { ...this.props.menuItemInfoStyle, ...child.props.menuItemInfoStyle },
                    menuItemLabelStyle: { ...this.props.menuItemLabelStyle, ...child.props.menuItemLabelStyle },
                    menuItemArrowStyle: { ...this.props.menuItemArrowStyle, ...child.props.menuItemArrowStyle },
                    menuItemActiveStyle: { ...this.props.menuItemActiveStyle, ...child.props.menuItemActiveStyle },
                };

                if (!('keyboard' in child.props)) {
                    props.keyboard = this.props.keyboard || false;
                }

                if (!('action' in child.props) || !child.props.action) {
                    props.action = this.props.action;
                }

                const menu = React.cloneElement(child, props);

                let className = styles['react-menu-bar-menu-bar-item'] + ' react-menu-bar-menu-bar-item ';
                if (active) {
                    // TODO: do I need this?
                    className += styles['react-menu-bar-menu-bar-item-active'] + ' react-menu-bar-menu-bar-item-active';
                }

                const style = { ...this.props.childStyle };

                return (
                    <li
                        className={className}
                        style={style}
                        onMouseOver={this.handleMouseOver.bind(this, index)}
                        tabIndex={index + 1}
                    >
                        {child.props.label}
                        <br />
                        {menu}
                    </li>
                );
            } else {
                return child;
            }
        });
    }

    public render(): JSX.Element {
        const { style, ...rest } = this.props;

        delete rest.children;
        delete rest.keyboard;
        delete rest.action;

        return (
            <ul
                {...rest}
                className={styles['react-menu-bar-menu-bar-container'] + ' react-menu-bar-menu-bar-container'}
                style={{ ...style }}
                onMouseDown={this.handleMouseDown}
                onMouseOut={this.handleMouseOut}
                ref={(node): void => {
                    this.ul = node;
                }}
            >
                {this.renderChildren()}
            </ul>
        );
    }
}

export default Menubar;
