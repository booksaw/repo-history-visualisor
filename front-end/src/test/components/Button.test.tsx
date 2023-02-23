import { render } from '@testing-library/react';
import Button from "../../components/Button";


test("Test rendering button", () => {

    const { container } = render(<Button text={"test"} />);


    expect(container.firstChild).toHaveTextContent("test");
    expect(container.firstChild).toHaveClass("buttonClass");
    expect(container.firstChild).toHaveClass("intputStyle");
    expect(container.firstChild).toHaveAttribute("type", "button");
});

test("Test rendering button with class", () => {


    const { container } = render(<Button text={"test"} className={"testClass"} />);

    // console.log(container.classNameitem());

    expect(container.firstChild).toHaveTextContent("test");
    expect(container.firstChild).toHaveClass("buttonClass");
    expect(container.firstChild).toHaveClass("intputStyle");
    expect(container.firstChild).toHaveClass("testClass");
})

test("Test changing button type", () => {

    const { container } = render(<Button text={"test"} className={"testClass"} type={"submit"} />);


    expect(container.firstChild).toHaveTextContent("test");
    expect(container.firstChild).toHaveAttribute("type", "submit");

})