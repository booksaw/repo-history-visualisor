import { fireEvent, render } from "@testing-library/react";
import CloneForm from "../../components/CloneForm";
import * as QueryStringUtils from '../../utils/QueryStringUtils';

beforeEach(() => {
    jest.doMock("../../utils/QueryStringUtils", () => {
        const component = () => <></>;
        return component;
    });
});

test("Test displaying error text", () => {
    let { container } = render(<CloneForm errorText={"test"} setVisData={() => { }} setDebugMode={() => { }} setDisplayForm={() => { }} setErrorText={() => { }} setManualMode={() => { }} />)
    expect(container.querySelector("#cloneErrorText")!).toHaveTextContent("test");
});

test("Test submitting without branch", () => {
    jest.spyOn(QueryStringUtils, "getQueryString").mockReturnValue({clone: "url"})

    let setErrorText = jest.fn();

    let { container } = render(<CloneForm setErrorText={setErrorText} setVisData={() => { }} setDebugMode={() => { }} setDisplayForm={() => { }} setManualMode={() => { }} />)
    fireEvent.submit(container.firstChild!.firstChild!);

    expect(setErrorText).toHaveBeenCalledWith("Branch must be specified");
});

test("Test submitting without url", () => {
    jest.spyOn(QueryStringUtils, "getQueryString").mockReturnValue({branch: "branch"})

    let setErrorText = jest.fn();

    let { container } = render(<CloneForm setErrorText={setErrorText} setVisData={() => { }} setDebugMode={() => { }} setDisplayForm={() => { }} setManualMode={() => { }} />)
    fireEvent.submit(container.firstChild!.firstChild!);

    expect(setErrorText).toHaveBeenCalledWith("Repository URL must be specified");
});