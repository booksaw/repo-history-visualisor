import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event'
import MoreOptions from './MoreOptions';

test("Test expanding more options", () => {

    const { container } = render(<MoreOptions setDebugMode={() => { }} setManualMode={() => { }} setMilestoneURL={() => { }} />)

    expect(container.querySelector("#moreExpandControlDiv")).toHaveStyle("display: none")

    fireEvent.click(container.querySelector("#moreExpandButton")!, {});
    expect(container.querySelector("#moreExpandControlDiv")).toHaveStyle("display: flex")
})

test("Test setting debug mode", () => {

    let updated: boolean = false;
    const setMode = (v: boolean) => { updated = v }

    let { rerender, container } = render(<MoreOptions debugMode={updated} setDebugMode={setMode} setManualMode={() => { }} setMilestoneURL={() => { }} />)

    userEvent.click(container.querySelector("#moreDebugInput")!);
    rerender(<MoreOptions debugMode={updated} setDebugMode={setMode} setManualMode={() => { }} setMilestoneURL={() => { }} />)

    expect(updated).toEqual(true);
    expect(container.querySelector("#moreDebugInput")!).toBeChecked();

})

test("Test setting manual mode", () => {

    let updated: boolean = false;
    const setMode = (v: boolean) => { updated = v }

    let { rerender, container } = render(<MoreOptions manualMode={updated} setDebugMode={() => { }} setManualMode={setMode} setMilestoneURL={() => { }} />)

    userEvent.click(container.querySelector("#moreManualInput")!);
    rerender(<MoreOptions manualMode={updated} setDebugMode={() => { }} setManualMode={setMode} setMilestoneURL={() => { }} />)

    expect(updated).toEqual(true);
    expect(container.querySelector("#moreManualInput")!).toBeChecked();
})

test("Test setting milestone url", () => {

    let updated: string = "a";
    const setMode = (v: string) => { updated = v }

    let { rerender, container } = render(<MoreOptions milestoneURL={updated} setDebugMode={() => { }} setManualMode={() => { }} setMilestoneURL={setMode} />)

    userEvent.type(container.querySelector("#moreMilestonesInput")!, "a");
    rerender(<MoreOptions milestoneURL={updated} setDebugMode={() => { }} setManualMode={() => { }} setMilestoneURL={setMode} />)

    expect(updated).toEqual("aa");
})
