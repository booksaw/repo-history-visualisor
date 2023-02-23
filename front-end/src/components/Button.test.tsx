import ReactDOM from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Button from "./Button";

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

    act(() => {
        ReactDOM.createRoot(containerCopy).render(<Button text={"test"} />);
    });

    // console.log(container.classNameitem());

    expect(containerCopy.firstChild).toHaveTextContent("test");
    expect(containerCopy.firstChild).toHaveClass("buttonClass");
    expect(containerCopy.firstChild).toHaveClass("intputStyle");
    expect(containerCopy.firstChild).toHaveAttribute("type", "button");
});

test("Test rendering button with class", () => {

    if (!container) {
        throw Error("Container is not defined before tests");
    }
    let containerCopy = container;

    act(() => {
        ReactDOM.createRoot(containerCopy).render(<Button text={"test"} className={"testClass"} />);
    });

    // console.log(container.classNameitem());

    expect(containerCopy.firstChild).toHaveTextContent("test");
    expect(containerCopy.firstChild).toHaveClass("buttonClass");
    expect(containerCopy.firstChild).toHaveClass("intputStyle");
    expect(containerCopy.firstChild).toHaveClass("testClass");
})

test("Test changing button type", () => {

    if (!container) {
        throw Error("Container is not defined before tests");
    }
    let containerCopy = container;

    act(() => {
        ReactDOM.createRoot(containerCopy).render(<Button text={"test"} className={"testClass"} type={"submit"} />);
    });

    expect(containerCopy.firstChild).toHaveTextContent("test");
    expect(containerCopy.firstChild).toHaveAttribute("type", "submit");

})