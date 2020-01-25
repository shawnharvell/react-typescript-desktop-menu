import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Menu from './menu';
import styles from './default-styles.css';

interface ContextMenuProps {
    children: React.ReactNode;
    menu: React.ReactNode;
    onContextMenu?: (e: React.MouseEvent) => void;
}

interface ContextMenuState {
    display: boolean;
    position: {
        x: number;
        y: number;
    };
}

class ContextMenu extends Component<ContextMenuProps, ContextMenuState> {
    public static propTypes = {
        children: PropTypes.node,
        menu: PropTypes.node,
        onContextMenu: PropTypes.func,
    };

    private menu: any;

    constructor(props: ContextMenuProps) {
        super(props);

        this.state = { display: false, position: { x: 0, y: 0 } };

        this.handleBlurWindow = this.handleBlurWindow.bind(this);
        this.handleClickDoc = this.handleClickDoc.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);

        this.menu = React.createRef<Menu>();
    }

    public close(): void {
        this.setState({ display: false });
    }

    public handleBlurWindow(): void {
        this.close();
    }

    public handleClickDoc(e: any): void {
        if (!this.menu.current) {
            return;
        }

        const { current } = this.menu;

        if (current && !current.contains(e.target)) {
            this.close();
        }
    }

    public handleContextMenu(e: React.MouseEvent): void {
        e.preventDefault();
        e.persist();

        this.setState({ display: true }, () => this.setPosition(e));

        if (this.props.onContextMenu) {
            this.props.onContextMenu(e);
        }
    }

    public setPosition(e: React.MouseEvent): void {
        if (!this.menu) {
            return;
        }

        const { current } = this.menu;

        if (!current) {
            return;
        }

        let x = e.clientX;
        let y = e.clientY;

        if (e.clientX + current.offsetWidth > window.innerWidth) {
            x -= current.offsetWidth;
            if (x < 0) {
                x = window.innerWidth - current.offsetWidth;
            }
        }

        if (e.clientY + current.offsetHeight > window.innerHeight) {
            y -= current.offsetHeight;
            if (y < 0) {
                y = window.innerHeight - current.offsetHeight;
            }
        }

        this.setState({ position: { x, y } });
    }

    public addEventListeners(): void {
        document.addEventListener('mousedown', this.handleClickDoc);
        window.addEventListener('blur', this.handleBlurWindow);
    }

    public removeEventListeners(): void {
        document.removeEventListener('mousedown', this.handleClickDoc);
        window.removeEventListener('blur', this.handleBlurWindow);
    }

    public componentDidUpdate(prevProps: ContextMenuProps, prevState: ContextMenuState): void {
        if (this.state.display && !prevState.display) {
            this.addEventListeners();
        } else if (!this.state.display && prevState.display) {
            this.removeEventListeners();
        }
    }

    public componentWillUnmount(): void {
        this.removeEventListeners();
    }

    public handlePreventDefault(e: React.MouseEvent): void {
        e.preventDefault();
    }

    public render(): any {
        const { children, menu, ...rest } = this.props;

        const content = React.Children.only(children) as any;

        const container = React.cloneElement(content, {
            key: 'container',
            ...rest,
            onContextMenu: this.handleContextMenu,
        });
        if (this.state.display) {
            const className = styles['react-menu-bar-context-menu'] + ' react-menu-bar-context-menu';
            const contextMenu = ReactDOM.createPortal(
                <div
                    key="contextMenu"
                    ref={this.menu}
                    onContextMenu={this.handlePreventDefault}
                    className={className}
                    style={{
                        position: 'fixed',
                        left: this.state.position.x,
                        top: this.state.position.y,
                        zIndex: 100000,
                    }}
                >
                    {menu}
                </div>,
                document.body,
            );

            return [container, contextMenu];
        } else {
            return container;
        }
    }
}

export default ContextMenu;
