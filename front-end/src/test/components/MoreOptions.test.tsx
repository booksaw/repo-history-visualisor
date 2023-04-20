import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoreOptions from '../../components/MoreOptions';
import { SpeedOptions, VisualisationSpeedOptions } from '../../visualisation/VisualisationSpeedOptions';

test("Test expanding more options", () => {

    const { container } = render(
        <MoreOptions
            setDebugMode={() => { }}
            setSpeed={() => { }}
            setSettingsURL={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)

    expect(container.querySelector("#moreExpandControlDiv")).toHaveStyle("display: none")

    fireEvent.click(container.querySelector("#moreExpandButton")!, {});
    expect(container.querySelector("#moreExpandControlDiv")).toHaveStyle("display: block")
})

test("Test setting debug mode", () => {

    let updated: boolean = false;
    const setMode = (v: boolean) => { updated = v }

    let { rerender, container } = render(
        <MoreOptions
            debugMode={updated}
            setDebugMode={setMode}
            setSpeed={() => { }}
            setSettingsURL={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)

    userEvent.click(container.querySelector("#moreDebugInput")!);
    rerender(
        <MoreOptions
            debugMode={updated}
            setDebugMode={setMode}
            setSpeed={() => { }}
            setSettingsURL={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)

    expect(updated).toEqual(true);
    expect(container.querySelector("#moreDebugInput")!).toBeChecked();

})

test("Test setting manual mode", () => {

    let updated: VisualisationSpeedOptions = SpeedOptions.NORMAL;
    const setMode = (v: VisualisationSpeedOptions) => { updated = v }

    let { rerender, container } = render(
        <MoreOptions
            speed={updated}
            setDebugMode={() => { }}
            setSpeed={setMode}
            setSettingsURL={() => { }}
            setKey={() => { }}
            setDisplayFileNames={() => { }}
        />)

    fireEvent.change(container.querySelector("#moreSpeedInput")!, { target: { value: "FAST" } });
    rerender(
        <MoreOptions
            speed={updated}
            setDebugMode={() => { }}
            setSpeed={setMode}
            setSettingsURL={() => { }}
            setKey={() => { }}
            setDisplayFileNames={() => { }}
        />)

    expect(updated).toEqual(SpeedOptions.FAST);
})

test("Test setting the key to hide", () => {

    let updated: boolean | undefined = false;
    const setMode = (v: boolean) => { updated = v }

    let { rerender, container } = render(
        <MoreOptions
            fileKey={updated}
            setDebugMode={() => { }}
            setSpeed={() => { }}
            setSettingsURL={() => { }}
            setKey={setMode}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)

    userEvent.click(container.querySelector("#moreKeyInput")!);
    rerender(
        <MoreOptions
            fileKey={updated}
            setDebugMode={() => { }}
            setSpeed={() => { }}
            setSettingsURL={() => { }}
            setKey={setMode}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)

    expect(updated).toEqual(true);
    expect(container.querySelector("#moreKeyInput")!).toBeChecked();
})

test("Test setting a settings url", () => {

    let updated: string = "a";
    const setMode = (v: string) => { updated = v }

    let { rerender, container } = render(
        <MoreOptions
            settingsURL={updated}
            setDebugMode={() => { }}
            setSpeed={() => { }}
            setSettingsURL={setMode}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)

    userEvent.type(container.querySelector("#moreSettingsInput")!, "a");
    rerender(
        <MoreOptions
            settingsURL={updated}
            setDebugMode={() => { }}
            setSpeed={() => { }}
            setSettingsURL={setMode}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={() => { }}
        />)

    expect(updated).toEqual("aa");
})

test("Test setting hide file names", () => {

    let updated: boolean | undefined = undefined;
    const setMode = (v: boolean | undefined) => { updated = v }

    let { rerender, container } = render(
        <MoreOptions
            displayFileNames={updated}
            setDebugMode={() => { }}
            setSpeed={() => { }}
            setSettingsURL={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={setMode}
        />)

    userEvent.click(container.querySelector("#moreFilesInput")!);
    rerender(
        <MoreOptions
            displayFileNames={updated}
            setDebugMode={() => { }}
            setSpeed={() => { }}
            setSettingsURL={() => { }}
            setKey={() => { }}
            speed={SpeedOptions.NORMAL}
            setDisplayFileNames={setMode}
        />)

    expect(updated).toEqual(true);
    expect(container.querySelector("#moreFilesInput")!).toBeChecked();
})