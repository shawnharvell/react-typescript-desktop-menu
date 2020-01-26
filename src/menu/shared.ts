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

export interface MenuStyles {
    unorderedlist?: CSSProperties;
    menuitem?: MenuItemStyles;
}

export interface MenubarStyles {
    unorderedlist?: CSSProperties;
    listitem?: CSSProperties;
    menubar?: MenubarStyles;
    menu?: MenuStyles;
}

export interface MenuItemClassNames {
    listitem?: string;
    icon?: string;
    disabled?: string;
    info?: string;
    label?: string;
    arrow?: string;
    active?: string;
}

export interface MenuClassNames {
    unorderedlist?: string;
    menuitem?: string;
}

export interface MenubarClassNames {
    unorderedlist?: string;
    listitem?: string;
    menubar?: string;
    menu?: MenuClassNames;
}
