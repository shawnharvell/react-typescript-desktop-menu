import { useEffect, useCallback, useState } from 'react';

const useContextMenu = (outerRef: any, onSetOpen: (open: boolean) => void) => {
    const [xPos, setXPos] = useState('0px');
    const [yPos, setYPos] = useState('0px');

    const handleContextMenu = useCallback(
        event => {
            event.preventDefault();
            if (outerRef && outerRef.current.contains(event.target)) {
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
