import { FileData, DirectoryData, LinkData } from "../components/NetworkDiagram";
import { addDirectory, removeDirectory } from "../utils/RepositoryRepresentationUtils";
import DrawnLineManager from "./DrawnLineManager";

class DirectoryStructureManager {
    addNode(fileData: FileData, fileClusters: FileData[], indexedFileClusters: { [key: string]: string[] }, nodes: DirectoryData[], links: LinkData[], displayChangesFor: number, contributor: string) {
        addDirectory(nodes, links, fileData.directory);
        // checking if the file already exsists (sometimes the same file can be created in multiple commits)
        if (fileClusters.some(f => f.name === fileData.name && f.directory === fileData.directory)) {
            // element already exists
            DrawnLineManager.addModifiedLine(fileData, displayChangesFor, contributor);
            return;
        }
    
        //  adding the new node
        fileClusters.push(fileData);
        indexedFileClusters[fileData.directory] = [...indexedFileClusters[fileData.directory] ?? [], fileData.name];
    
        DrawnLineManager.addAddedLine(fileData, displayChangesFor, contributor);
    }
    
    removeNode(fileData: FileData, fileClusters: FileData[], indexedFileClusters: { [key: string]: string[] }, nodes: DirectoryData[], links: LinkData[]) {
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
}

export default new DirectoryStructureManager();