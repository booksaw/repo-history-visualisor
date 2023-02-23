import { act, fireEvent } from '@testing-library/react';
import ReactDOM from 'react-dom/client';
import TextInput from './TextInput';

let container: HTMLDivElement | null;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    if (!container) {
        return;
    }

    document.body.removeChild(container);
    container = null;
});


test("Test rendering button", () => {

    if (!container) {
        throw Error("Container is not defined before tests");
    }
    let containerCopy = container;
    let changed = false;

    const onChange = () => {
        changed = true;
    }

    const event = {
        preventDefault() { },
        target: { value: 'change' }
    };

    act(() => {
        ReactDOM.createRoot(containerCopy).render(<TextInput onChange={onChange} />);
    });

    expect(containerCopy.firstChild).toHaveClass("textInputClass");
    expect(containerCopy.firstChild).toHaveClass("intputStyle");

    act(() => {
        fireEvent.change(containerCopy.firstChild!, event);
    })

    expect(changed).toBeTruthy();
});

test("Test providing class", () => {
    if (!container) {
        throw Error("Container is not defined before tests");
    }
    let containerCopy = container;

    act(() => {
        ReactDOM.createRoot(containerCopy).render(<TextInput className='testClass' />);
    });


    expect(containerCopy.firstChild).toHaveClass("testClass");
})