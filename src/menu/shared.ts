import { CSSProperties } from 'react';

export interface MenuItemStyles {
    listitem?: CSSProperties;
    icon?: CSSProperties;
    disabled?: CSSProperties;
    info?: CSSProperties;
    label?: CSSProperties;
    arrow?: CSSProperties;
    active?: CSSProperties;
}

export interface MenuBarStyles {
    unorderedlist?: CSSProperties;
    listitem?: CSSProperties;
}

export interface MenuStyles {
    menu?: CSSProperties;
    menuitem?: MenuItemStyles;
    menubar?: MenuBarStyles;
}
