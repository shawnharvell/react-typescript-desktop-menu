import React, { useEffect } from 'react';

export type OnClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

// note to minimize re-runs of this, when calling, pass your handler wrapped in useCallback
const useOnClickOutside = (ref: React.MutableRefObject<null>, handler: OnClickOutsideHandler): void => {
    useEffect(() => {
        if (ref === null || ref.current === null) {
            return;
        }

        const listener = (event: MouseEvent | TouchEvent): void => {
            // eslint-disable-next-line
            // @ts-ignore
            if (!ref || !ref.current || ref.current.contains(event.target)) {
                return;
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return (): void => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

export default useOnClickOutside;
