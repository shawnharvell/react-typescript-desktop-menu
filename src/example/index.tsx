import React, { useRef, useState } from 'react';
import Menubar, { MenuItem, Menu, Divider, ContextMenu } from '../menu';

import './index.css';

const Example: React.FC = props => {
    const outerRef = useRef(null);
    const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
    const [menuBarIsOpen, setMenuBarIsOpen] = useState(false);
    const [checkboxMenuItemState, setCheckboxMenuItemState] = useState(false);

    const handleCheckboxChange = (checked: boolean): void => {
        setCheckboxMenuItemState(checked);
    };

    const onMenuBarSetOpen = (open: boolean): void => {
        setMenuBarIsOpen(open);
    };

    const onContextMenuSetOpen = (open: boolean): void => {
        setContextMenuIsOpen(open);
    };

    const menubarHandler = (tag: string, checked: boolean, e: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
        console.log('menubarHandler', tag, checked, e);
        onMenuBarSetOpen(false);
    };

    const menuHandler = (tag: string, checked: boolean, e: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
        console.log('menuHandler', tag, checked, e);
        onMenuBarSetOpen(false);
    };

    const menuitemHandler = (tag: string, checked: boolean, e: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
        console.log('menuitemHandler', tag, checked, e);
        onMenuBarSetOpen(false);
    };

    const contextmenuHandler = (
        tag: string,
        checked: boolean,
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    ): void => {
        console.log('contextmenuHandler', tag, checked, e);
        onContextMenuSetOpen(false);
    };

    const contextmenuSubmenuHandler = (
        tag: string,
        checked: boolean,
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    ): void => {
        console.log('contextmenuSubmenuHandler', tag, checked, e);
        onContextMenuSetOpen(false);
    };

    const contextMenu = (
        <Menu label="File" action={contextmenuHandler} display={true}>
            <MenuItem tag="simple" label="Simple item" />
            <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with icon" />
            <MenuItem tag="anyicon" icon={<img src="icon.svg" alt="" />} label="Item with any kind of icon" />
            <Divider />
            <MenuItem tag="submenu" icon={<i className="fa fa-bar-chart" />} label="Submenu">
                <Menu action={contextmenuSubmenuHandler}>
                    <MenuItem tag="simple" label="Simple item" />
                    <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with icon" />
                    <MenuItem tag="anyicon" icon={<img src="icon.svg" alt="" />} label="Item with any kind of icon" />
                </Menu>
            </MenuItem>
        </Menu>
    );

    return (
        <div id="outer" ref={outerRef}>
            <h2>React Menu Bar Example</h2>
            <div className="menu-bar-container container">
                <Menubar action={menubarHandler} isOpen={menuBarIsOpen} onSetOpen={onMenuBarSetOpen} {...props}>
                    <Menu label="File">
                        <MenuItem tag="simple" label="Simple Item" />
                        <MenuItem tag="txticon" label="Glyph String Icon" icon="fa fa-save" />
                        <MenuItem tag="jsxicon" icon={<i className="fa fa-bell" />} label="JSX Icon" />
                        <MenuItem tag="anyicon" icon={<img src="icon.svg" alt="" />} label="Image Icon" />
                        <Divider />
                        <MenuItem
                            tag="customhover"
                            label="Custom hover color"
                            menuStyles={{ menuitem: { active: { backgroundColor: 'pink' } } }}
                        />
                        <MenuItem
                            tag="checkbox"
                            checkbox
                            checked={checkboxMenuItemState}
                            onSetChecked={handleCheckboxChange}
                        >
                            {' '}
                            Item as a checkbox{' '}
                        </MenuItem>
                        <MenuItem
                            tag="shortcut"
                            icon={<i className="fa fa-modx" />}
                            shortcut="s"
                            label="Item with shortcut"
                        />
                        <MenuItem tag="info" icon={<i className="fa fa-print" />} info="Info" label="Item with info" />
                        <Divider />
                        <MenuItem tag="submenu" icon={<i className="fa fa-bar-chart" />} label="Submenu">
                            <Menu>
                                <MenuItem tag="simple" label="Simple item" />
                                <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="JSX icon" />
                                <MenuItem tag="anyicon" icon={<img src="icon.svg" alt="" />} label="JSX Icon" />
                            </Menu>
                        </MenuItem>
                    </Menu>
                    <Menu label="Edit" action={menuHandler}>
                        <MenuItem tag="simple" label="Disabled item" disabled />
                        <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="JSX Glyph Icon" />
                        <MenuItem tag="anyicon" icon={<img src="icon.svg" alt="" />} label="JSX Icon" />
                        <Divider />
                        <MenuItem tag="submenu" icon={<i className="fa fa-bar-chart" />} label="Submenu w/JSX Icon">
                            <Menu>
                                <MenuItem tag="simple" label="Simple item" />
                                <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with glyph icon" />
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
                        <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with glyph icon" />
                        <MenuItem
                            tag="anyicon"
                            icon={<img src="icon.svg" alt="" />}
                            label="Item with any kind of icon"
                        />
                        <Divider />
                        <MenuItem tag="submenu" icon={<i className="fa fa-bar-chart" />} label="Submenu">
                            <Menu>
                                <MenuItem tag="simple" label="Simple item" />
                                <MenuItem tag="icon" icon={<i className="fa fa-bell" />} label="Item with glyph icon" />
                                <MenuItem
                                    action={menuitemHandler}
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
                menu={contextMenu}
                outerRef={outerRef}
                isOpen={contextMenuIsOpen}
                onSetOpen={onContextMenuSetOpen}
                {...props}
            >
                <div className="pseudo-editor-window container">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id sem sit amet odio ullamcorper
                        facilisis. Suspendisse non ex mauris. Praesent risus nibh, semper sit amet nisl a, vestibulum
                        eleifend purus. Proin a scelerisque justo. Maecenas pellentesque a enim nec molestie. In
                        porttitor dignissim vulputate. Aliquam erat volutpat. Vestibulum egestas blandit est. Nullam
                        lectus sem, varius sed commodo vel, feugiat eget justo. In hac habitasse platea dictumst. Morbi
                        aliquet orci eget leo porta, nec scelerisque justo tristique. Etiam elementum semper
                        scelerisque.
                    </p>

                    <p>
                        Sed leo quam, cursus id vehicula sed, fermentum non leo. Vivamus volutpat magna non urna aliquet
                        eleifend. Ut viverra convallis pretium. Orci varius natoque penatibus et magnis dis parturient
                        montes, nascetur ridiculus mus. Cras pharetra mattis urna ut laoreet. Praesent luctus lorem in
                        massa fermentum, quis gravida nisl hendrerit. Sed congue gravida felis ac laoreet. Proin
                        scelerisque vulputate velit, vitae pulvinar velit lacinia nec. Etiam ut quam vitae turpis
                        lacinia gravida. Morbi eu lectus ac velit eleifend euismod. Morbi eget purus sed nisi malesuada
                        fringilla vitae a quam. Nulla commodo volutpat rutrum. Praesent consectetur, nibh vitae gravida
                        consequat, neque enim egestas nisl, id accumsan eros nisi id tellus. Nam in justo viverra,
                        luctus magna non, pellentesque velit.
                    </p>

                    <p>
                        Duis sit amet lobortis tortor, nec viverra orci. In accumsan hendrerit iaculis. Integer non orci
                        non quam dictum pulvinar quis quis enim. Maecenas ex lorem, venenatis eget dolor in, sodales
                        convallis odio. Donec sed felis suscipit ligula sagittis tristique. Donec at ligula ac lectus
                        malesuada venenatis. Sed sit amet dolor in felis convallis pulvinar. Maecenas id molestie metus.
                        In eu consectetur metus. In quis consequat lacus. Phasellus in pellentesque sapien. Aliquam
                        accumsan velit vel venenatis malesuada. Fusce mollis ultricies urna eget faucibus.
                    </p>

                    <div id="overlay">
                        <p>Right-click/CTRL-click to display context menu</p>
                    </div>
                </div>
            </ContextMenu>
        </div>
    );
};

export default Example;
