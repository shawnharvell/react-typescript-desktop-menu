import { CSSProperties } from 'react';

export interface MenuItemStyles {
    listitem?: CSSProperties;
    listitemActive?: CSSProperties;
    listitemDisabled?: CSSProperties;
    icon?: CSSProperties;
    disabled?: CSSProperties;
    info?: CSSProperties;
    label?: CSSProperties;
    arrow?: CSSProperties;
    active?: CSSProperties;
    checkbox?: CSSProperties;
}

export interface MenuStyles {
    unorderedlist?: CSSProperties;
    menuitem?: MenuItemStyles;
}

export interface MenubarStyles {
    unorderedlist?: CSSProperties;
    listitem?: CSSProperties;
    activeListitem?: CSSProperties;
    menu?: MenuStyles;
}

export interface MenuItemClassNames {
    listitem?: string;
    listitemActive?: string;
    listitemDisabled?: string;
    icon?: string;
    disabled?: string;
    info?: string;
    label?: string;
    arrow?: string;
    active?: string;
    checkbox?: string;
}

export interface MenuClassNames {
    unorderedlist?: string;
    menuitem?: MenuItemClassNames;
}

export interface MenubarClassNames {
    unorderedlist?: string;
    listitem?: string;
    activeListitem?: string;
    menu?: MenuClassNames;
}
