import { DirectoryData, LinkData, FileData, NodeData } from "./components/NetworkDiagram";
import { ContributorProps } from "./components/RepositoryVisualisor";
import { Filechangetype, Repository } from "./RepositoryRepresentation";
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
    ) => void,
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
export function addCommit(
    displayChangesFor: number,
    visData: Repository,
    nodes: DirectoryData[],
    links: LinkData[],
    indexedFileClusters: { [key: string]: string[] },
    fileClusters: FileData[],
    contributors: {[name: string]: ContributorProps},
): void {

    // finalising all animation elements from previous commits
    delayedChanges.forEach(change => {
        change.applyChange(nodes, links, indexedFileClusters, fileClusters);
    })

    console.log("Adding commit");
    if (!visData || visData.commits.length === 0) {
        console.log("No more commits to display");
        return;
    }

    const commit = visData.commits.shift()!;

    // managing contributions 
    if(!contributors[commit.a]) {
        // adding new contributor
        contributors[commit.a] = {name: commit.a, x: Object.keys(contributors).length * 30, y: 0};
    }

    commit.c.forEach(change => {
        const fileData = getFileData(change.f);

        if (change.t === Filechangetype.ADDED) {
            // adding the containing directory

            addNode(fileData, fileClusters, indexedFileClusters, nodes, links, displayChangesFor, commit.a);

        } else if (change.t === Filechangetype.DELETED) {

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

function modifiedFile(fileData: FileData, displayChangesFor: number, contributor: string) {
    const lineDraw: DrawnLines = { targetDirectory: fileData.directory, targetName: fileData.name, color: MODIFIED_COLOR, contributor: contributor};
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
 * Function to create the function which handles timing of commit triggers
 * @param ticksToProgress The number of ticks required to progress to the next commit
 * @param addCommit The function to add a commit
 * @param visData The visualisation data for the repository
 * @param nodes The nodes currently being displayed
 * @param setNodes Function to set the nodes
 * @param links The links currently being displayed 
 * @param setLinks Function to set the links
 * @param indexedFileClusters The indexed file clusters
 * @param setIndexedFileClusters Function to set indexed file clusters
 * @param fileClusters the file clusters
 * @param setFileClusters Function to set file clusters
 * @returns The created function 
 */
export function createTickFunction(
    ticksToProgress: number,
    displayChangesFor: number,
    visData: Repository,
    nodes: DirectoryData[],
    setNodes: (nodes: DirectoryData[]) => void,
    links: LinkData[],
    setLinks: (nodes: LinkData[]) => void,
    indexedFileClusters: { [key: string]: string[] },
    setIndexedFileClusters: (indexed: { [key: string]: string[] }) => void,
    fileClusters: FileData[],
    setFileClusters: (clusters: FileData[]) => void,
    contributors: {[name: string]: ContributorProps},
    setContributors: (set: {[name: string]: ContributorProps}) => void,
) {

    const tick = function () {
        if (ticksToProgress === -1) {
            return;
        }

        currentTicks++;
        if (currentTicks >= ticksToProgress) {
            addCommit(displayChangesFor, visData, nodes, links, indexedFileClusters, fileClusters, contributors);
            currentTicks = 0;
        }

        updateScheduledChanges(nodes, links, indexedFileClusters, fileClusters);

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
) {

    [...delayedChanges].forEach(change => {
        change.ticksUntilChange--;
        if (change.ticksUntilChange <= 0) {
            change.applyChange(nodes, links, indexedFileClusters, fileClusters);
            const index = delayedChanges.indexOf(change);
            delayedChanges.splice(index, 1);
        }


    })
}

function addNode(fileData: FileData, fileClusters: FileData[], indexedFileClusters: { [key: string]: string[] }, nodes: NodeData[], links: LinkData[], displayChangesFor: number, contributor: string) {
    addDirectory(nodes, links, { name: fileData.directory });
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

function removeNode(fileData: FileData, fileClusters: FileData[], indexedFileClusters: { [key: string]: string[] }, nodes: NodeData[], links: LinkData[]) {
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

export function renderLines(ctx: CanvasRenderingContext2D, globalScale: number, fileClusters: FileData[], contributors: {[name: string]: ContributorProps}) {

    drawnLines.forEach(line => {
        const targetLst = fileClusters.filter(fc => fc.name === line.targetName && fc.directory === line.targetDirectory);
        if (targetLst.length < 1) {
            return;
        }
        const target = targetLst[0];
        const source = contributors[line.contributor];

        if (target.x === undefined || target.y === undefined  || !source || source.x === undefined || source.y === undefined) {
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