import { fireEvent, render } from "@testing-library/react";
import CloneForm from "../../components/CloneForm";
import * as QueryStringUtils from '../../utils/QueryStringUtils';
import * as BackEndCommunicator from '../../utils/BackEndCommunicator'
import userEvent from "@testing-library/user-event";
import { SpeedOptions } from "../../visualisation/VisualisationSpeedOptions";

beforeEach(() => {
    jest.doMock("../../components/MoreOptions", () => {
        const component = () => <></>;
        return component;
    });
});

afterEach(() => {
    jest.restoreAllMocks();
})

test("Test displaying error text", () => {
    let { container } = render(
        <CloneForm
            setDataState={() => { }}
            errorText={"test"}
            setRepoDataManager={() => { }}
            setDebugMode={() => { }}
            setDisplayForm={() => { }}
            setErrorText={() => { }}
            setSpeed={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)
    expect(container.querySelector("#cloneErrorText")!).toHaveTextContent("test");
});

test("Test submitting without branch", () => {
    jest.spyOn(QueryStringUtils, "getQueryString").mockReturnValue({ repo: "url" })

    let setErrorText = jest.fn();

    let { container } = render(
        <CloneForm
            setDataState={() => { }}
            setErrorText={setErrorText}
            setRepoDataManager={() => { }}
            setDebugMode={() => { }}
            setDisplayForm={() => { }}
            setSpeed={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)
    fireEvent.submit(container.firstChild!.firstChild!);

    expect(setErrorText).toHaveBeenCalledWith("Branch must be specified");
});

test("Test submitting without url", () => {
    jest.spyOn(QueryStringUtils, "getQueryString").mockReturnValue({ branch: "branch" })

    let setErrorText = jest.fn();

    let { container } = render(
        <CloneForm
            setDataState={() => { }}
            setErrorText={setErrorText}
            setRepoDataManager={() => { }}
            setDebugMode={() => { }}
            setDisplayForm={() => { }}
            setSpeed={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)
    fireEvent.submit(container.firstChild!.firstChild!);

    expect(setErrorText).toHaveBeenCalledWith("Repository URL must be specified");
});

test("Test loading into visualisation", () => {

    jest.spyOn(QueryStringUtils, "getQueryString").mockReturnValue({ repo: "url", branch: "branch" })
    jest.spyOn(QueryStringUtils, "setQueryString").mockReturnValue();
    const JSONData = jest.spyOn(BackEndCommunicator, "performPrevis").mockImplementation(async () => { });

    render(
        <CloneForm
            setDataState={() => { }}
            setErrorText={() => { }}
            setRepoDataManager={() => { }}
            setDebugMode={() => { }}
            setDisplayForm={() => { }}
            setSpeed={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)

    expect(JSONData).toHaveBeenCalledTimes(1);
});

test("Test submitting valid data", () => {
    jest.spyOn(QueryStringUtils, "getQueryString").mockReturnValue({})
    const JSONData = jest.spyOn(BackEndCommunicator, "performPrevis").mockImplementation(async () => { });

    let { container, getByPlaceholderText } = render(
        <CloneForm
            setDataState={() => { }}
            setErrorText={() => { }}
            setRepoDataManager={() => { }}
            setDebugMode={() => { }}
            setDisplayForm={() => { }}
            setSpeed={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)

    userEvent.type(getByPlaceholderText("Repository Clone Url..."), "a");
    userEvent.type(getByPlaceholderText("Branch..."), "b");
    fireEvent.submit(container.firstChild!.firstChild!);

    expect(JSONData).toHaveBeenCalledTimes(1);

});
