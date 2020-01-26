import Menubar, { Divider, MenuItem, Menu } from './';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// const mockedClickEvent = { preventDefault: () => {} };
const mockedActionHandler = jest.fn((tag: string, checked: boolean, e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    console.debug(tag, checked, e);
});

Enzyme.configure({ adapter: new Adapter() });

describe('Divider', () => {
    it('renders without crashing', () => {
        const wrapper = mount(<Divider />);

        wrapper.unmount();
    });
});

describe('Menubar', () => {
    it('renders without crashing', () => {
        const mockOnSetOpen = jest.fn();

        const wrapper = mount(
            <Menubar action={mockedActionHandler} isOpen={true} onSetOpen={mockOnSetOpen}>
                <Menu label="test menu">
                    <MenuItem label="test item" tag="test-item" />
                </Menu>
            </Menubar>,
        );

        wrapper.unmount();
    });
});
