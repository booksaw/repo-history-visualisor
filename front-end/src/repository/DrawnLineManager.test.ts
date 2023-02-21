import { FileData } from "../components/NetworkDiagram";
import { TestWrapperVariableDataProps } from "../test/VariableDataPropsTestUtils";
import DrawnLineManager from "./DrawnLineManager";
import ScheduledChangeManager from "./ScheduledChangeManager";


afterEach(() => {
    const props = new TestWrapperVariableDataProps();
    ScheduledChangeManager.applyAllChanges(props.props);
});

test("Test adding a line of type modified", () => {
    const fd: FileData = {name: "test", directory: "testdir", changeType: "M", color: "red"};

    DrawnLineManager.addModifiedLine(fd, 1, "contributor");

    expect(DrawnLineManager.drawnLines.length).toEqual(1);
});

test("Test adding a line of type added", () => {
    const fd: FileData = {name: "test", directory: "testdir", changeType: "A", color: "red"};

    DrawnLineManager.addAddedLine(fd, 1, "contributor");

    expect(DrawnLineManager.drawnLines.length).toEqual(1);
});

test("Test adding a line of type removed", () => {
    const fd: FileData = {name: "test", directory: "testdir", changeType: "D", color: "red"};

    DrawnLineManager.addRemovedLine(fd, 1, "contributor");

    expect(DrawnLineManager.drawnLines.length).toEqual(1);
});

test("Test applying the change manager to remove a line", () => {
    const fd: FileData = {name: "test", directory: "testdir", changeType: "D", color: "red"};
    const props = new TestWrapperVariableDataProps();

    DrawnLineManager.addRemovedLine(fd, 1, "contributor");
    ScheduledChangeManager.updateScheduledChanges(props.props);
    
    expect(DrawnLineManager.drawnLines.length).toEqual(0);

}); 