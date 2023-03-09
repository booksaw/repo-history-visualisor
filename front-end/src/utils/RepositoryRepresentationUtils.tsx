import { DirectoryData, FileData, LinkData } from "../components/NetworkDiagram";
import FileColorManager from "../repository/FileColorManager";
import { FileChange } from "../repository/RepositoryRepresentation";


export function removeDirectory(nodeData: DirectoryData[], links: LinkData[], indexedFileClusters: { [key: string]: string[] }, dir: DirectoryData) {
    const index = nodeData.indexOf(dir);
    if (index === -1 || links.filter(n => n.getSourceName() === dir.name).length !== 0 || (indexedFileClusters[dir.name] && indexedFileClusters[dir.name].length > 0)) {
        return;
    }

    // removing the directory
    nodeData.splice(index, 1);

    // removing all links to that directory
    links.filter(n => n.getTargetName() === dir.name).forEach(link => {
        const linkIndex = links.indexOf(link);
        links.splice(linkIndex, 1);
    })

    // checking for its parent
    const split = dir.name.split("/");
    split.pop();
    const parentName = split.join("/");
    // cannot delete base node
    if (parentName.length === 0) {
        return;
    }
    const filter = nodeData.filter(n => n.name === parentName);
    removeDirectory(nodeData, links, indexedFileClusters, filter[0]);
}

export function addDirectory(nodeData: DirectoryData[], links: LinkData[], dirName: string) {
    // checking if this node exists
    const filter = nodeData.filter(n => n.name === dirName);
    if (filter.length === 1 || dirName.length === 0) {
        // if node exists, all parents exist and no processing is required
        return;
    }//f

    // adding parent directories
    const split = dirName.split("/");
    split.pop();
    const parentName = split.join("/");
    if (parentName.length !== 0) {
        addDirectory(nodeData, links, parentName);
    }

    // parent must now exist
    // but the dir does not already exist
    // getting parent data
    const parent = nodeData.filter(nd => nd.name === parentName)[0];

    // pushing this directory
    nodeData.push({ name: dirName, x: parent.x, y: parent.y });
    // adding link
    links.push(new LinkData(parentName, dirName));
    // links.push({ source: "0", target: dir.name });
}

export interface ModifiedFileData {
    fileData: FileData;
    changeType: string;
}

export function getModifiedFileData(file: FileChange): ModifiedFileData {
    const split = file.file.split("/");

    const name = split.pop()!;
    const dir = split.join("/");
    const extension = name.split(".").pop()!;
    const color = FileColorManager.getColorFromExtension(extension);

    return { changeType: file.type, fileData: { name: name, directory: dir, color: color, fileExtension: extension } };
}