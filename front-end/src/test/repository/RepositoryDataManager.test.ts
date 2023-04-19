import RepositoryDataManager from "../../repository/RepositoryDataManager";
import ScheduledChangeManager from "../../repository/ScheduledChangeManager";
import { VisualisationSpeedOptions } from "../../visualisation/VisualisationSpeedOptions";
import { TestWrapperVariableDataProps } from "../VariableDataPropsTestUtils";

test("Test getting request parameters without settings", () => {
    const params = RepositoryDataManager.getRequestParams("clone", "branch");

    expect(params).toEqual({ repo: "clone", branch: "branch" });
});

test("Test getting request parameters with settings", () => {
    const params = RepositoryDataManager.getRequestParams("clone", "branch", "settings");

    expect(params).toEqual({ repo: "clone", branch: "branch", settings: "settings" });
});

test("Test requesting initial metadata", async () => {

    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    const setDataState = jest.fn();
    const setError = jest.fn();

    await manager.requestInitialMetadata(setError, setDataState);

    expect(setDataState).toHaveBeenCalled();
    expect(setError).not.toHaveBeenCalled();

});

test("Test processInitialMetadata no settings", () => {

    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    manager.metadata = { url: "clone", branch: "branch", totalCommits: 1 }

    manager.processInitialMetadata();

    expect(manager.activeStructures).toHaveLength(0);
});

test("Test processInitialMetadata no structures", () => {

    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    manager.metadata = { url: "clone", branch: "branch", totalCommits: 1, settings: {} }

    manager.processInitialMetadata();

    expect(manager.activeStructures).toHaveLength(0);
});

test("Test processInitialMetadata with structure", () => {

    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    manager.metadata = {
        url: "clone", branch: "branch", totalCommits: 1,
        settings: {
            structures: [{ folder: "folder", label: "label" }]
        }
    }

    manager.processInitialMetadata();

    expect(manager.activeStructures).toHaveLength(1);
});

test("Test processStructureChanges no settings", () => {

    const props = new TestWrapperVariableDataProps();

    const visOptions: VisualisationSpeedOptions = { contributorMovementTicks: 0, displayChangesFor: 0, ticksToProgress: 0 }
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    manager.metadata = { url: "clone", branch: "branch", totalCommits: 1 };

    manager.processStructureChanges(
        { author: "author", changes: [], commitHash: "A", commitId: 0, timestamp: 0 },
        visOptions, props.props);

    expect(props.props.nodes.value).toHaveLength(0)

})

test("Test processStructureChanges no structures", () => {

    const props = new TestWrapperVariableDataProps();

    const visOptions: VisualisationSpeedOptions = { contributorMovementTicks: 0, displayChangesFor: 0, ticksToProgress: 0 }
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    manager.metadata = { url: "clone", branch: "branch", totalCommits: 1, settings: {} };

    manager.processStructureChanges(
        { author: "author", changes: [], commitHash: "A", commitId: 0, timestamp: 0 },
        visOptions, props.props);

    expect(props.props.nodes.value).toHaveLength(0)

})

test("Test processStructureChanges valid structures", () => {

    const props = new TestWrapperVariableDataProps();
    props.props.nodes.value = [{ name: "", x: 0, y: 0 }]

    const visOptions: VisualisationSpeedOptions = { contributorMovementTicks: 0, displayChangesFor: 0, ticksToProgress: 0 }
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    const activeStructure = { folder: "folderCollapse", label: "label", endCommitHash: "A", collapse: true };
    manager.metadata = {
        url: "clone", branch: "branch", totalCommits: 1, settings: {
            structures: [
                { folder: "folder", label: "label", startCommitHash: "A" },
                { folder: "folder", label: "label", endCommitHash: "A" },
                { folder: "folderCollapse", label: "label", startCommitHash: "A", collapse: true },
                activeStructure
            ]
        }
    };

    manager.activeStructures = [activeStructure]

    manager.processStructureChanges(
        { author: "author", changes: [], commitHash: "A", commitId: 0, timestamp: 0 },
        visOptions, props.props);

    expect(props.props.nodes.value).toHaveLength(1);
    expect(manager.activeStructures).toHaveLength(2);

})

test("Test loading commit data", async () => {

    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });

    const setError = jest.fn();

    manager.loadCommitData(setError, 0);

    expect(setError).not.toHaveBeenCalled()

})

test("Test getProcessVisDataFunction", () => {
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    const visOptions: VisualisationSpeedOptions = { contributorMovementTicks: 0, displayChangesFor: 0, ticksToProgress: 0 }
    const props = new TestWrapperVariableDataProps();

    const fn = manager.getProcessVisDataFunction(visOptions);
    fn(props.props);

    expect(fn).toBeDefined();



});

test("test addCommitToQueue no metadata", () => {

    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    const visOptions: VisualisationSpeedOptions = { contributorMovementTicks: 0, displayChangesFor: 0, ticksToProgress: 0 }
    const props = new TestWrapperVariableDataProps();

    manager.addCommitToQueue(visOptions, props.props);

    expect(props.props.nodes.value).toHaveLength(0);
});

test("Test addCommiToQueue after commit duration", () => {
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    const visOptions: VisualisationSpeedOptions = { contributorMovementTicks: 0, displayChangesFor: 0, ticksToProgress: 0 }
    const props = new TestWrapperVariableDataProps();

    manager.metadata = {
        branch: "branch",
        totalCommits: 0,
        url: "clone"
    }

    manager.addCommitToQueue(visOptions, props.props);

    expect(props.props.nodes.value).toHaveLength(0);

});

test("Test addCommiToQueue undefined commit", () => {
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    const visOptions: VisualisationSpeedOptions = { contributorMovementTicks: 0, displayChangesFor: 0, ticksToProgress: 0 }
    const props = new TestWrapperVariableDataProps();

    manager.metadata = {
        branch: "branch",
        totalCommits: 1,
        url: "clone"
    }

    manager.addCommitToQueue(visOptions, props.props);

    expect(props.props.nodes.value).toHaveLength(0);

});

test("Test addCommiToQueue valid commit", () => {
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    const visOptions: VisualisationSpeedOptions = { contributorMovementTicks: 0, displayChangesFor: 0, ticksToProgress: 0 }
    const props = new TestWrapperVariableDataProps();

    ScheduledChangeManager.delayedChanges = [];

    props.props.nodes.value = [{
        name: "", x: 0, y: 0
    }]

    const deleteNode = { color: "c", directory: "", name: "testD", fileExtension: "" };
    const modifiedMode =  { color: "c", directory: "", name: "testM", fileExtension: "" }; 

    props.props.fileClusters.value = [
        deleteNode,
        modifiedMode,
    ]

    props.props.indexedFileClusters.value[""] = ["testD", "testM"];

    manager.metadata = {
        branch: "branch",
        totalCommits: 1,
        url: "clone"
    }

    manager.commits[0] = {
        author: "author",
        commitHash: "A",
        commitId: 0,
        timestamp: 0,
        changes: [
            { file: "testD", type: "D" },
            { file: "folder/testA", type: "A" },
            { file: "testM", type: "M" },
        ]
    }

    manager.addCommitToQueue(visOptions, props.props);

    expect(ScheduledChangeManager.delayedChanges).toHaveLength(3);


});

test("Test getMilestone no settings", () => {
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    manager.metadata = {
        url: "clone", branch: "branch", totalCommits: 1,

    }

    const result = manager.getMilestone("A");

    expect(result).not.toBeDefined();
})

test("Test getMilestone no milestones", () => {
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    manager.metadata = {
        url: "clone", branch: "branch", totalCommits: 1,
        settings: {}
    }

    const result = manager.getMilestone("A");

    expect(result).not.toBeDefined();
})

test("Test getMilestone with milestone not returned", () => {
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    const milestone = {commitHash: "B", commitID: 0, milestone: "Test"};
    manager.metadata = {
        url: "clone", branch: "branch", totalCommits: 1,
        settings: {
            milestones: [
                milestone
            ]
        }
    }

    const result = manager.getMilestone("A");

    expect(result).not.toBeDefined();
})

test("Test getMilestone with milestone", () => {
    const manager = new RepositoryDataManager({ repo: "clone", branch: "branch" });
    const milestone = {commitHash: "A", commitID: 0, milestone: "Test"};
    manager.metadata = {
        url: "clone", branch: "branch", totalCommits: 1,
        settings: {
            milestones: [
                milestone
            ]
        }
    }

    const result = manager.getMilestone("A");

    expect(result).toEqual(milestone);
})