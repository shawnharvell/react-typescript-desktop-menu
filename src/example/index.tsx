import React, { Component } from 'react';
import Menubar, { MenuItem, Menu, Divider, ContextMenu } from '../menu';

import './index.css';

export default class App extends Component {
    // let myMenubar: Menubar = useRef(null);

    menubar: Menubar | null = null;
    contextmenu: ContextMenu | null = null;

    menubarHandler = (tag: string, checked: boolean, e: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
        console.log('menubarHandler', tag, checked, e);
        this.menubar?.close();
    };

    menuHandler = (tag: string, checked: boolean, e: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
        console.log('menuHandler', tag, checked, e);
        this.menubar?.close();
    };

    menuitemHandler = (tag: string, checked: boolean, e: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
        console.log('menuitemHandler', tag, checked, e);
        this.menubar?.close();
    };

    contextmenuHandler = (tag: string, checked: boolean, e: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
        console.log('contextmenuHandler', tag, checked, e);
        this.contextmenu?.close();
    };

    render(): JSX.Element {
        const menu = (
            <Menu label="File" action={this.contextmenuHandler}>
                <MenuItem tag="simple" label="Simple item" />
                <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with icon" />
                <MenuItem tag="anyicon" icon={<img src="icon.svg" alt="" />} label="Item with any kind of icon" />
                <Divider />
                <MenuItem tag="submenu" icon={<i className="fa fa-bar-chart" />} label="Submenu">
                    <Menu action={this.menuHandler}>
                        <MenuItem tag="simple" label="Simple item" />
                        <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with icon" />
                        <MenuItem
                            tag="anyicon"
                            icon={<img src="icon.svg" alt="" />}
                            label="Item with any kind of icon"
                        />
                    </Menu>
                </MenuItem>
            </Menu>
        );

        return (
            <div id="outer">
                <h2>React Menu Bar Example</h2>
                <div className="menu-bar-container container">
                    <Menubar
                        // eslint-disable-next-line
                        ref={elmt => (this.menubar = elmt)}
                        style={{ border: '1px solid #eee' }}
                        action={this.menubarHandler}
                        {...this.props}
                    >
                        <Menu label="Icons">
                            <MenuItem tag="simple" label="Simple Item" />
                            <MenuItem tag="txticon" label="String Icon" icon="fa fa-save" />
                            <MenuItem tag="jsxicon" icon={<i className="fa fa-bell" />} label="JSX Icon" />
                            <MenuItem tag="anyicon" icon={<img src="icon.svg" alt="" />} label="Image Icon" />
                            <Divider />
                            <MenuItem tag="customhover" label="Custom hover color" />
                            <MenuItem tag="checkbox" checkbox>
                                {' '}
                                Item as a checkbox{' '}
                            </MenuItem>
                            <MenuItem tag="checkboxdefaultchecked" checkbox defaultChecked>
                                {' '}
                                Item as a checkbox checked{' '}
                            </MenuItem>
                            <MenuItem
                                tag="shortcut"
                                icon={<i className="fa fa-modx" />}
                                shortcut="s"
                                label="Item with shortcut"
                            />
                            <MenuItem
                                tag="info"
                                icon={<i className="fa fa-print" />}
                                info="Info"
                                label="Item with info"
                            />
                            <Divider />
                            <MenuItem tag="submenu" icon={<i className="fa fa-bar-chart" />} label="Submenu">
                                <Menu>
                                    <MenuItem tag="simple" label="Simple item" />
                                    <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with icon" />
                                    <MenuItem
                                        tag="anyicon"
                                        icon={<img src="icon.svg" alt="" />}
                                        label="Item with any kind of icon"
                                    />
                                </Menu>
                            </MenuItem>
                        </Menu>
                        <Menu label="Edit" action={this.menuHandler}>
                            <MenuItem tag="simple" label="Disabled item" disabled />
                            <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with icon" />
                            <MenuItem
                                tag="anyicon"
                                icon={<img src="icon.svg" alt="" />}
                                label="Item with any kind of icon"
                            />
                            <Divider />
                            <MenuItem tag="submenu" icon={<i className="fa fa-bar-chart" />} label="Submenu">
                                <Menu>
                                    <MenuItem tag="simple" label="Simple item" />
                                    <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with icon" />
                                    <MenuItem
                                        tag="anyicon"
                                        icon={<img src="icon.svg" alt="" />}
                                        label="Item with any kind of icon"
                                    />
                                </Menu>
                            </MenuItem>
                        </Menu>
                        <Menu label="View">
                            <MenuItem tag="simple" label="Simple item" />
                            <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with icon" />
                            <MenuItem
                                tag="anyicon"
                                icon={<img src="icon.svg" alt="" />}
                                label="Item with any kind of icon"
                            />
                            <Divider />
                            <MenuItem tag="submenu" icon={<i className="fa fa-bar-chart" />} label="Submenu">
                                <Menu>
                                    <MenuItem tag="simple" label="Simple item" />
                                    <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with icon" />
                                    <MenuItem
                                        action={this.menuitemHandler}
                                        tag="anyicon"
                                        icon={<img src="icon.svg" alt="" />}
                                        label="Item with any kind of icon"
                                    />
                                </Menu>
                            </MenuItem>
                        </Menu>
                    </Menubar>
                </div>
                <ContextMenu
                    menu={menu}
                    // eslint-disable-next-line
                    ref={elmt => (this.contextmenu = elmt)}
                    {...this.props}
                >
                    <div className="pseudo-editor-window container">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id sem sit amet odio
                            ullamcorper facilisis. Suspendisse non ex mauris. Praesent risus nibh, semper sit amet nisl
                            a, vestibulum eleifend purus. Proin a scelerisque justo. Maecenas pellentesque a enim nec
                            molestie. In porttitor dignissim vulputate. Aliquam erat volutpat. Vestibulum egestas
                            blandit est. Nullam lectus sem, varius sed commodo vel, feugiat eget justo. In hac habitasse
                            platea dictumst. Morbi aliquet orci eget leo porta, nec scelerisque justo tristique. Etiam
                            elementum semper scelerisque.
                        </p>

                        <p>
                            Sed leo quam, cursus id vehicula sed, fermentum non leo. Vivamus volutpat magna non urna
                            aliquet eleifend. Ut viverra convallis pretium. Orci varius natoque penatibus et magnis dis
                            parturient montes, nascetur ridiculus mus. Cras pharetra mattis urna ut laoreet. Praesent
                            luctus lorem in massa fermentum, quis gravida nisl hendrerit. Sed congue gravida felis ac
                            laoreet. Proin scelerisque vulputate velit, vitae pulvinar velit lacinia nec. Etiam ut quam
                            vitae turpis lacinia gravida. Morbi eu lectus ac velit eleifend euismod. Morbi eget purus
                            sed nisi malesuada fringilla vitae a quam. Nulla commodo volutpat rutrum. Praesent
                            consectetur, nibh vitae gravida consequat, neque enim egestas nisl, id accumsan eros nisi id
                            tellus. Nam in justo viverra, luctus magna non, pellentesque velit.
                        </p>

                        <p>
                            Duis sit amet lobortis tortor, nec viverra orci. In accumsan hendrerit iaculis. Integer non
                            orci non quam dictum pulvinar quis quis enim. Maecenas ex lorem, venenatis eget dolor in,
                            sodales convallis odio. Donec sed felis suscipit ligula sagittis tristique. Donec at ligula
                            ac lectus malesuada venenatis. Sed sit amet dolor in felis convallis pulvinar. Maecenas id
                            molestie metus. In eu consectetur metus. In quis consequat lacus. Phasellus in pellentesque
                            sapien. Aliquam accumsan velit vel venenatis malesuada. Fusce mollis ultricies urna eget
                            faucibus.
                        </p>

                        <div id="overlay">
                            <p>Right-click/CTRL-click to display context menu</p>
                        </div>
                    </div>
                </ContextMenu>
            </div>
        );
    }
}
