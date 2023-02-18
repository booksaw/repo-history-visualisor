import { Filechangetype, Repository } from "./RepositoryRepresentation";
import { getFileData } from "../utils/RepositoryRepresentationUtils";
import DrawnLineManager from "./DrawnLineManager";
import { VariableDataProps } from "./VisualisationVariableManager";
import ScheduledChangeManager from "./ScheduledChangeManager";
import ContributorManager from "./ContributorManager";
import DirectoryStructureManager from "./DirectoryChangeManager";

let currentTicks = 0;

export function processVisData(
    ticksToProgress: number,
    displayChangesFor: number,
    contributorMovementTicks: number,
    visData: Repository,
) {
    return (props: VariableDataProps) => {
        if (ticksToProgress === -1) {
            return;
        }
        currentTicks++;
        if (currentTicks >= ticksToProgress) {
            addCommitToQueue(displayChangesFor, contributorMovementTicks, visData, props);
            currentTicks = 0;
        }

        ScheduledChangeManager.updateScheduledChanges(props);
    }
}


export function addCommitToQueue(
    displayChangesFor: number,
    contributorMovementTicks: number,
    visData: Repository,
    props: VariableDataProps
): void {

    ScheduledChangeManager.applyAllChanges(props);

    console.log("Adding commit");
    if (!visData || visData.commits.length === 0) {
        console.log("No more commits to display");
        return;
    }

    const commit = visData.commits.shift()!;

    // managing contributions 
    if (!props.contributors.value[commit.author]) {
        // adding new contributor
        props.contributors.value[commit.author] = { name: commit.author, x: 0, y: 0 };
    }

    const contributor = props.contributors.value[commit.author];

    const changesData = commit.changes.map(change => getFileData(change));

    const location = ContributorManager.getCommitContributorLocation(changesData, props.nodes.value);
    const changePerTick = ContributorManager.calculateChangePerTick(location, contributor, contributorMovementTicks);

    const applychangesFunction = function (
        props: VariableDataProps
    ) {
        changesData.forEach(fileData => {

            if (fileData.changeType === Filechangetype.ADDED) {
                // adding the containing directory

                DirectoryStructureManager.addNode(fileData, props.fileClusters.value, props.indexedFileClusters.value, props.nodes.value, props.links.value, displayChangesFor, commit.author);

            } else if (fileData.changeType === Filechangetype.DELETED) {

                DrawnLineManager.addRemovedLine(fileData, displayChangesFor, commit.author);

                ScheduledChangeManager.addDelayedChange({
                    ticksUntilChange: displayChangesFor,
                    applyChange: (lineProps: VariableDataProps) => {
                        DirectoryStructureManager.removeNode(fileData, lineProps.fileClusters.value, lineProps.indexedFileClusters.value, lineProps.nodes.value, lineProps.links.value);
                    }
                })
            } else {
                // modified
                DrawnLineManager.addModifiedLine(fileData, displayChangesFor, commit.author);
            }

        });
    }

    const contributorMoveFunction = ContributorManager.getContributorMoveFunction(commit, changePerTick);

    ScheduledChangeManager.addDelayedChange({ ticksUntilChange: contributorMovementTicks, applyChange: contributorMoveFunction, repeating: true });
    ScheduledChangeManager.addDelayedChange({ ticksUntilChange: contributorMovementTicks, applyChange: applychangesFunction });

    props.date.value = commit.timestamp;
    props.milestone.value = commit.milestone;

}
