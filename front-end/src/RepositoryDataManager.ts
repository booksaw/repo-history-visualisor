import { DirectoryData, LinkData, FileData } from "./components/NetworkDiagram";
import { ContributorProps } from "./components/RepositoryVisualisor";
import { Filechangetype, Repository } from "./RepositoryRepresentation";
import { Vector } from "./utils/MathUtils";
import { addDirectory, getFileData, removeDirectory } from "./utils/RepositoryRepresentationUtils";

const MODIFIED_COLOR = "orange";
const ADDED_COLOR = "green";
const DELETED_COLOR = "red";

interface ScheduledChanges {
    ticksUntilChange: number,
    applyChange: (
        nodes: DirectoryData[],
        links: LinkData[],
        indexedFileClusters: { [key: string]: string[] },
        fileClusters: FileData[],
        contributors: { [name: string]: ContributorProps }
    ) => void,
    repeating?: boolean,
}

interface DrawnLines {
    targetName: string,
    targetDirectory: string,
    color: string,
    contributor: string;
}

const delayedChanges: ScheduledChanges[] = [];
const drawnLines: DrawnLines[] = [];

/**
 * Function used to add a commit to the progress
 * @param visData The visualisation data for the repository
 * @param nodes The clone of nodes currently being displayed
 * @param links The clone of links currently being displayed 
 * @param indexedFileClusters The clone of indexed file clusters
 * @param fileClusters the clone of file clusters
 * @param contributors the contributors for the repository
 */
export function addCommitToQueue(
    displayChangesFor: number,
    contributorMovementTicks: number,
    visData: Repository,
    nodes: DirectoryData[],
    links: LinkData[],
    indexedFileClusters: { [key: string]: string[] },
    fileClusters: FileData[],
    contributors: { [name: string]: ContributorProps },
): void {

    // finalising all animation elements from previous commits
    delayedChanges.forEach(change => {
        change.applyChange(nodes, links, indexedFileClusters, fileClusters, contributors);
    })

    console.log("Adding commit");
    if (!visData || visData.commits.length === 0) {
        console.log("No more commits to display");
        return;
    }

    const commit = visData.commits.shift()!;

    // managing contributions 
    if (!contributors[commit.a]) {
        // adding new contributor
        contributors[commit.a] = { name: commit.a, x: 0, y: 0 };
    }

    const contributor = contributors[commit.a];

    const changesData = commit.c.map(change => getFileData(change));

    const location = getCommitContributorLocation(changesData, nodes);
    const changePerTick = Vector.subtract(location, new Vector(contributor.x, contributor.y));
    changePerTick.scale(1 / contributorMovementTicks);

    const applychangesFunction = function (
        changeNodes: DirectoryData[],
        changeLinks: LinkData[],
        changeIndexedFileClusters: { [key: string]: string[] },
        changeFileClusters: FileData[]
    ) {
        changesData.forEach(fileData => {

            if (fileData.changeType === Filechangetype.ADDED) {
                // adding the containing directory

                addNode(fileData, changeFileClusters, changeIndexedFileClusters, changeNodes, changeLinks, displayChangesFor, commit.a);

            } else if (fileData.changeType === Filechangetype.DELETED) {

                const lineDraw: DrawnLines = { targetDirectory: fileData.directory, targetName: fileData.name, color: DELETED_COLOR, contributor: commit.a };
                addScheduledLine(lineDraw, displayChangesFor);

                delayedChanges.push({
                    ticksUntilChange: displayChangesFor, applyChange: (
                        changeNodes: DirectoryData[],
                        changeLinks: LinkData[],
                        changeIndexedFileClusters: { [key: string]: string[] },
                        changeFileClusters: FileData[]
                    ) => {
                        removeNode(fileData, changeFileClusters, changeIndexedFileClusters, changeNodes, changeLinks);
                    }
                })
            } else {
                // modified
                modifiedFile(fileData, displayChangesFor, commit.a);
            }

        });
    }

    const contributorMoveFunction = function (
        _0: DirectoryData[],
        _1: LinkData[],
        _2: { [key: string]: string[] },
        _3: FileData[],
        contributors: { [name: string]: ContributorProps }
    ) {
        const contributor = contributors[commit.a];
        contributor.x += changePerTick.x;
        contributor.y += changePerTick.y;
    }

    delayedChanges.push({ ticksUntilChange: contributorMovementTicks, applyChange: contributorMoveFunction, repeating: true });
    delayedChanges.push({ ticksUntilChange: contributorMovementTicks, applyChange: applychangesFunction });
}

function getCommitContributorLocation(changes: FileData[], nodes: DirectoryData[],): Vector {

    let totx = 0;
    let toty = 0;
    let tot = 0;

    changes.forEach(change => {
        const dirs = nodes.filter(d => d.name === change.directory);
        if (dirs.length !== 1) {
            return;
        }
        const dir = dirs[0];

        if (dir.x !== undefined && dir.y !== undefined) {
            totx += dir.x;
            toty += dir.y;
            tot++;
        }
    })

    if (tot === 0) {
        return new Vector(0, 0);
    }

    return new Vector(totx / tot, toty / tot);
}

function modifiedFile(fileData: FileData, displayChangesFor: number, contributor: string) {
    const lineDraw: DrawnLines = { targetDirectory: fileData.directory, targetName: fileData.name, color: MODIFIED_COLOR, contributor: contributor };
    addScheduledLine(lineDraw, displayChangesFor);
}

function addScheduledLine(line: DrawnLines, displayChangesFor: number) {
    drawnLines.push(line);
    delayedChanges.push({
        ticksUntilChange: displayChangesFor, applyChange: () => {
            const index = drawnLines.indexOf(line);
            drawnLines.splice(index, 1);
        }
    })
}


let currentTicks = 0;

/**
 * function to create a tick function for the repository
 * @param ticksToProgress the nubmer of ticks between commits
 * @param displayChangesFor the number of ticks to show contribution lines for
 * @param contributorMovementTicks the number of ticks to move contributors for before showing contribution lines
 * @param visData repositroy data
 * @param nodes the directories for this repository
 * @param setNodes the set nodes function for this repository
 * @param links the links between directories 
 * @param setLinks function to set the links between directories
 * @param indexedFileClusters indexed file clusters
 * @param setIndexedFileClusters function to set indexed file clusters 
 * @param fileClusters file clusters for the repository 
 * @param setFileClusters function to set file clusters
 * @param contributors contributors for the repository
 * @param setContributors function to set the contributors
 * @returns the created tick function 
 */
export function createTickFunction(
    ticksToProgress: number,
    displayChangesFor: number,
    contributorMovementTicks: number,
    visData: Repository,
    nodes: DirectoryData[],
    setNodes: (nodes: DirectoryData[]) => void,
    links: LinkData[],
    setLinks: (nodes: LinkData[]) => void,
    indexedFileClusters: { [key: string]: string[] },
    setIndexedFileClusters: (indexed: { [key: string]: string[] }) => void,
    fileClusters: FileData[],
    setFileClusters: (clusters: FileData[]) => void,
    contributors: { [name: string]: ContributorProps },
    setContributors: (set: { [name: string]: ContributorProps }) => void,
) {

    const tick = function () {
        if (ticksToProgress === -1) {
            return;
        }

        currentTicks++;
        if (currentTicks >= ticksToProgress) {
            addCommitToQueue(displayChangesFor, contributorMovementTicks, visData, nodes, links, indexedFileClusters, fileClusters, contributors);
            currentTicks = 0;
        }

        updateScheduledChanges(nodes, links, indexedFileClusters, fileClusters, contributors);

        setNodes(nodes);
        setLinks(links);
        setIndexedFileClusters(indexedFileClusters);
        setFileClusters(fileClusters);
        setContributors(contributors);
    }

    return tick;
}

function updateScheduledChanges(
    nodes: DirectoryData[],
    links: LinkData[],
    indexedFileClusters: { [key: string]: string[] },
    fileClusters: FileData[],
    contributors: { [name: string]: ContributorProps }
) {

    [...delayedChanges].forEach(change => {
        change.ticksUntilChange--;
        if (change.repeating || change.ticksUntilChange <= 0) {
            change.applyChange(nodes, links, indexedFileClusters, fileClusters, contributors)
        }

        if (change.ticksUntilChange <= 0) {
            const index = delayedChanges.indexOf(change);
            delayedChanges.splice(index, 1);
        }


    })
}

function addNode(fileData: FileData, fileClusters: FileData[], indexedFileClusters: { [key: string]: string[] }, nodes: DirectoryData[], links: LinkData[], displayChangesFor: number, contributor: string) {
    addDirectory(nodes, links, fileData.directory);
    // checking if the file already exsists (sometimes the same file can be created in multiple commits)
    if (fileClusters.some(f => f.name === fileData.name && f.directory === fileData.directory)) {
        // element already exists
        modifiedFile(fileData, displayChangesFor, contributor);
        return;
    }

    //  adding the new node
    fileClusters.push(fileData);
    indexedFileClusters[fileData.directory] = [...indexedFileClusters[fileData.directory] ?? [], fileData.name];

    const lineDraw: DrawnLines = { targetDirectory: fileData.directory, targetName: fileData.name, color: ADDED_COLOR, contributor: contributor };
    addScheduledLine(lineDraw, displayChangesFor);

}

function removeNode(fileData: FileData, fileClusters: FileData[], indexedFileClusters: { [key: string]: string[] }, nodes: DirectoryData[], links: LinkData[]) {
    // removing the existing node
    let filter = fileClusters.filter(fd => fd.name === fileData.name && fd.directory === fileData.directory);
    if (filter.length !== 0) {
        const fileIndex = fileClusters.indexOf(filter[0]);
        if (fileIndex !== -1) {
            fileClusters.splice(fileIndex, 1)
        }
    }

    const arr = indexedFileClusters[fileData.directory];
    const indexedFileIndex = arr.indexOf(fileData.name);
    if (indexedFileIndex !== -1) {
        arr.splice(indexedFileIndex, 1);
    }

    const dir = nodes.filter(n => n.name === fileData.directory)[0];
    if (dir) {
        removeDirectory(nodes, links, indexedFileClusters, dir)
    }
}

export function renderLines(ctx: CanvasRenderingContext2D, globalScale: number, fileClusters: FileData[], contributors: { [name: string]: ContributorProps }) {

    drawnLines.forEach(line => {
        const targetLst = fileClusters.filter(fc => fc.name === line.targetName && fc.directory === line.targetDirectory);
        if (targetLst.length < 1) {
            return;
        }
        const target = targetLst[0];
        const source = contributors[line.contributor];

        if (target.x === undefined || target.y === undefined || !source || source.x === undefined || source.y === undefined) {
            return;
        }

        ctx.strokeStyle = line.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
    });

}