import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoreOptions from '../../components/MoreOptions';

test("Test expanding more options", () => {

    const { container } = render(<MoreOptions setDebugMode={() => { }} setManualMode={() => { }} setSettingsURL={() => { }} />)

    expect(container.querySelector("#moreExpandControlDiv")).toHaveStyle("display: none")

    fireEvent.click(container.querySelector("#moreExpandButton")!, {});
    expect(container.querySelector("#moreExpandControlDiv")).toHaveStyle("display: flex")
})

test("Test setting debug mode", () => {

    let updated: boolean = false;
    const setMode = (v: boolean) => { updated = v }

    let { rerender, container } = render(<MoreOptions debugMode={updated} setDebugMode={setMode} setManualMode={() => { }} setSettingsURL={() => { }} />)

    userEvent.click(container.querySelector("#moreDebugInput")!);
    rerender(<MoreOptions debugMode={updated} setDebugMode={setMode} setManualMode={() => { }} setSettingsURL={() => { }} />)

    expect(updated).toEqual(true);
    expect(container.querySelector("#moreDebugInput")!).toBeChecked();

})

test("Test setting manual mode", () => {

    let updated: boolean = false;
    const setMode = (v: boolean) => { updated = v }

    let { rerender, container } = render(<MoreOptions manualMode={updated} setDebugMode={() => { }} setManualMode={setMode} setSettingsURL={() => { }} />)

    userEvent.click(container.querySelector("#moreManualInput")!);
    rerender(<MoreOptions manualMode={updated} setDebugMode={() => { }} setManualMode={setMode} setSettingsURL={() => { }} />)

    expect(updated).toEqual(true);
    expect(container.querySelector("#moreManualInput")!).toBeChecked();
})

test("Test setting a settings url", () => {

    let updated: string = "a";
    const setMode = (v: string) => { updated = v }

    let { rerender, container } = render(<MoreOptions settingsURL={updated} setDebugMode={() => { }} setManualMode={() => { }} setSettingsURL={setMode} />)

    userEvent.type(container.querySelector("#moreSettingsInput")!, "a");
    rerender(<MoreOptions settingsURL={updated} setDebugMode={() => { }} setManualMode={() => { }} setSettingsURL={setMode} />)

    expect(updated).toEqual("aa");
})
