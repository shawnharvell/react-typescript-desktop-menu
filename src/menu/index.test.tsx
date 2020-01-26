import Menubar, { ContextMenu, MenuItem, Menu } from './';
import React, { useRef, useState } from 'react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';

const mockedEvent = { preventDefault: () => {} };
const mockedActionHandler = jest.fn((tag: string, checked: boolean, e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    //console.debug(tag, checked, e);
});

Enzyme.configure({ adapter: new Adapter() });

describe('Menus', () => {
    it('Menubar renders without crashing', () => {
        const mockOnSetOpen = jest.fn();

        const wrapper = mount(
            <Menubar action={mockedActionHandler} isOpen={true} onSetOpen={mockOnSetOpen}>
                <Menu label="test menu" display={true}>
                    <MenuItem
                        label="test item 1"
                        active={true}
                        tag="test-item1"
                        menuClassNames={{ menuitem: { listitem: 'find-me1' } }}
                    />
                    <MenuItem
                        label="test item 2"
                        active={true}
                        tag="test-item2"
                        menuClassNames={{ menuitem: { listitem: 'find-me2' } }}
                    />
                </Menu>
            </Menubar>,
        );
        wrapper.update();
        expect(wrapper.find('Menu')).toHaveLength(1);

        wrapper.unmount();
    });

    it('ContextMenu renders without crashing', async done => {
        const Container: React.FC = () => {
            const outerRef = useRef(null);
            const [isOpen, setIsOpen] = useState(true);

            const contextmenu = (
                <Menu label="test menu" display={true} action={mockedActionHandler}>
                    <MenuItem
                        label="test item 1"
                        active={true}
                        tag="test-item1"
                        menuClassNames={{ menuitem: { listitem: 'find-me1' } }}
                    />
                    <MenuItem
                        label="test item 2"
                        active={true}
                        tag="test-item2"
                        menuClassNames={{ menuitem: { listitem: 'find-me2' } }}
                    />
                </Menu>
            );

            return (
                <div ref={outerRef}>
                    <ContextMenu menu={contextmenu} outerRef={outerRef} isOpen={isOpen} onSetOpen={setIsOpen}>
                        <div>test content</div>
                    </ContextMenu>
                </div>
            );
        };

        const wrapper = mount(<Container />);
        wrapper.update();

        expect(wrapper.find('Menu')).toHaveLength(1);
        expect(wrapper.find('MenuItem')).toHaveLength(2);
        expect(wrapper.find('.find-me1')).toHaveLength(1);
        act(() => {
            wrapper
                .find('.find-me1')
                .first()
                .simulate('click', mockedEvent);
        });

        wrapper.update();

        expect(mockedActionHandler).toHaveBeenCalled();

        done();
    });
});
