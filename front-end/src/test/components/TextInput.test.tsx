import { act, fireEvent, render } from '@testing-library/react';
import TextInput from '../../components/TextInput';

test("Test rendering button", () => {

    let changed = false;

    const onChange = () => {
        changed = true;
    }

    const event = {
        preventDefault() { },
        target: { value: 'change' }
    };

    const { container } = render(<TextInput onChange={onChange} />);

    expect(container.firstChild).toHaveClass("textInputClass");
    expect(container.firstChild).toHaveClass("intputStyle");

    fireEvent.change(container.firstChild!, event);


    expect(changed).toBeTruthy();
});

test("Test providing class", () => {


    const { container } = render(<TextInput className='testClass' />);


    expect(container.firstChild).toHaveClass("testClass");
})