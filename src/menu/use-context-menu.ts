import React from 'react';
import { useEffect, useCallback, useState } from 'react';

export type ContextMenuPosition = {
    xPos: string;
    yPos: string;
};

const useContextMenu = (
    outerRef: React.MutableRefObject<null>,
    onSetOpen: (open: boolean) => void,
): ContextMenuPosition => {
    const [xPos, setXPos] = useState('0px');
    const [yPos, setYPos] = useState('0px');

    const handleContextMenu = useCallback(
        event => {
            event.preventDefault();
            // eslint-disable-next-line
            // @ts-ignore
            if (outerRef && outerRef.current && outerRef.current.contains(event.target)) {
                setXPos(`${event.pageX}px`);
                setYPos(`${event.pageY}px`);
                onSetOpen && onSetOpen(true);
            } else {
                onSetOpen && onSetOpen(false);
            }
        },
        [onSetOpen, outerRef, setXPos, setYPos],
    );

    useEffect(() => {
        document.addEventListener('contextmenu', handleContextMenu);
        return (): void => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    });

    return { xPos, yPos };
};

export default useContextMenu;
