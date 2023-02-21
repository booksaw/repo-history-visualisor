import { TestWrapperVariableDataProps } from "../test/VariableDataPropsTestUtils";
import ScheduledChangeManager from "./ScheduledChangeManager";

test("test applying all changes", () => {

    let applied = false;
    const props = new TestWrapperVariableDataProps();

    const applyFun = () => {applied = true};

    ScheduledChangeManager.addDelayedChange({ticksUntilChange: 1, applyChange: applyFun})
    ScheduledChangeManager.applyAllChanges(props.props);

    expect(applied).toEqual(true)
});

test("test applying change", () => {

    let applied = false;
    const props = new TestWrapperVariableDataProps();

    const applyFun = () => {applied = !applied};

    ScheduledChangeManager.addDelayedChange({ticksUntilChange: 1, applyChange: applyFun})
    ScheduledChangeManager.updateScheduledChanges(props.props);
    ScheduledChangeManager.updateScheduledChanges(props.props);

    expect(applied).toEqual(true)
});

test("test repeting change", () => {

    let applied = 0;
    const props = new TestWrapperVariableDataProps();

    const applyFun = () => {applied += 1};

    ScheduledChangeManager.addDelayedChange({ticksUntilChange: 3, applyChange: applyFun, repeating: true})
    ScheduledChangeManager.updateScheduledChanges(props.props);
    ScheduledChangeManager.updateScheduledChanges(props.props);
    ScheduledChangeManager.updateScheduledChanges(props.props);

    expect(applied).toEqual(3);
});

test("Test removing a change", () => {
    let applied = false;
    const props = new TestWrapperVariableDataProps();

    const applyFun = () => {applied = true};
    const change = {ticksUntilChange: 1, applyChange: applyFun, repeating: true}; 

    ScheduledChangeManager.addDelayedChange(change);
    ScheduledChangeManager.removeChange(change);
    ScheduledChangeManager.updateScheduledChanges(props.props);
    
    expect(applied).toEqual(false);
})