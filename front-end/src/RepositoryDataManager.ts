import { DirectoryData, LinkData, FileData } from "./components/NetworkDiagram";
import { Filechangetype, Repository } from "./RepositoryRepresentation";
import { addDirectory, getFileData, removeDirectory } from "./utils/RepositoryRepresentationUtils";

/**
 * Function used to add a commit to the progress
 * @param visData The visualisation data for the repository
 * @param nodes The clone of nodes currently being displayed
 * @param setNodes Function to set the nodes
 * @param links The clone of links currently being displayed 
 * @param setLinks Function to set the links
 * @param indexedFileClusters The clone of indexed file clusters
 * @param setIndexedFileClusters Function to set indexed file clusters
 * @param fileClusters the clone of file clusters
 * @param setFileClusters Function to set file clusters
 */
export function addCommit(
    visData: Repository,
    nodes: DirectoryData[],
    setNodes: (nodes: DirectoryData[]) => void,
    links: LinkData[],
    setLinks: (nodes: LinkData[]) => void,
    indexedFileClusters: { [key: string]: string[] }, 
    setIndexedFileClusters: (indexed: { [key: string]: string[] }) => void,
    fileClusters: FileData[],
    setFileClusters: (clusters: FileData[]) => void
): void{

    if (!visData || visData.commits.length === 0) {
        console.log("No more commits to display");
        return;
    }

    const commit = visData.commits.shift()!;

    commit.c.forEach(change => {
        const fileData = getFileData(change.f);

        if (change.t === Filechangetype.ADDED) {
            // adding the containing directory
            addDirectory(nodes, links, { name: fileData.directory });
            console.log("typeof " + typeof fileClusters, fileClusters)
            // checking if the file already exsists (sometimes the same file can be created in multiple commits)
            if (fileClusters.some(f => f.name === fileData.name && f.directory === fileData.directory)) {
                // element already exists
                return;
            }

            //  adding the new node
            fileClusters.push(fileData);
            indexedFileClusters[fileData.directory] = [...indexedFileClusters[fileData.directory] ?? [], fileData.name];

        } else if (change.t === Filechangetype.DELETED) {
            // removing the existing node
            fileClusters = fileClusters.filter(fd => fd.name !== fileData.name || fd.directory !== fileData.directory);
            indexedFileClusters[fileData.directory] = indexedFileClusters[fileData.directory].filter(fd => fd !== fileData.name);

            const dir = nodes.filter(n => n.name === fileData.directory)[0];
            if (dir) {
                removeDirectory(nodes, links, indexedFileClusters, dir)
            }
        }

    });
    setNodes(nodes);
    setLinks(links);
    setFileClusters(fileClusters);
    setIndexedFileClusters(indexedFileClusters);

}

/**
 * Function to create the function which handles timing of commit triggers
 * @param ticksToProgress The number of ticks required to progress to the next commit
 * @param addCommit The function to add a commit
 * @returns The created function 
 */
export function createTickFunction(ticksToProgress: number, addCommit: () => void) {
    let currentTicks = 0;
    const tick = function() {
        if(ticksToProgress === -1){
            return;
        }

        currentTicks++; 
        if(currentTicks >= ticksToProgress) {
            addCommit();
            currentTicks = 0;
        }
    }

    return tick;
}