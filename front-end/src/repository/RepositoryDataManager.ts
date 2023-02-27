import { Filechangetype, Milestone, Repository, RepositoryMetadata } from "./RepositoryRepresentation";
import { getFileData } from "../utils/RepositoryRepresentationUtils";
import DrawnLineManager from "./DrawnLineManager";
import { VariableDataProps } from "./VisualisationVariableManager";
import ScheduledChangeManager from "./ScheduledChangeManager";
import ContributorManager from "./ContributorManager";
import DirectoryStructureManager from "./DirectoryChangeManager";
import { loadCommitData, performPrevis } from "../utils/BackEndCommunicator";

/**
 * The URL query parameters that can be set
 */
export interface RequestParams {
    clone?: string;
    branch?: string;
    manual?: boolean;
    debug?: boolean;
    settings?: string;
}

export enum DataState {
    AWAITING_LOADING_METADATA,
    LOADING_METADATA,
    AWAITING_LOADING_COMMITS,
    LOADING_COMMITS,
    READY,
}


export default class RepositoryDataManager {

    static getRequestParams(
        cloneURL: string,
        branch: string,
        settings: string,

    ) {
        const params: RequestParams = {
            clone: cloneURL,
            branch: branch,
        };

        if (settings) {
            params.settings = settings;
        }
        return params;
    }

    private params: RequestParams;
    private currentTicks = 0;
    private repository: Repository | undefined;
    private metadata: RepositoryMetadata | undefined;


    constructor(params: RequestParams) {
        this.params = params;
    }

    async requestInitialMetadata(setError: (error: string) => void, setDataState: (state: DataState) => void) {
        setDataState(DataState.LOADING_METADATA);
        await performPrevis(this.params, (data: any) => { setDataState(DataState.AWAITING_LOADING_COMMITS); this.metadata = data }, setError);
    }

    async loadCommitData(setError: (error: string) => void, setDataState: (state: DataState) => void) {
        setDataState(DataState.LOADING_COMMITS);
        await loadCommitData(this.params, (data: any) => { setDataState(DataState.READY); this.repository = data }, setError)
    }

    getProcessVisDataFunction(
        ticksToProgress: number,
        displayChangesFor: number,
        contributorMovementTicks: number,
    ) {
        return (props: VariableDataProps) => {
            if (ticksToProgress === -1 || !this.repository) {
                return;
            }
            this.currentTicks++;
            if (this.currentTicks >= ticksToProgress) {
                this.addCommitToQueue(displayChangesFor, contributorMovementTicks, props);
                this.currentTicks = 0;
            }

            ScheduledChangeManager.updateScheduledChanges(props);
        }
    }

    addCommitToQueue(
        displayChangesFor: number,
        contributorMovementTicks: number,
        props: VariableDataProps
    ): void {

        ScheduledChangeManager.applyAllChanges(props);

        console.log("Adding commit");
        if (!this.repository || this.repository.commits.length === 0) {
            console.log("No more commits to display");
            return;
        }

        const commit = this.repository.commits.shift()!;

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
        const milestone = this.getMilestone(commit.commitHash);
        if (milestone) {
            props.milestone.value = milestone;
        }

    }

    getMilestone(commitHash: string): Milestone | undefined {
        if (!this.metadata?.settings?.milestones) {
            return undefined;
        }

        const lst = this.metadata.settings.milestones.filter(value => value.commitHash === commitHash);

        if (!lst || lst.length === 0) {
            return undefined;
        }

        if (lst[0].displayFor === undefined) {
            lst[0].displayFor = 1000;
        }

        return lst[0];
    }

}

