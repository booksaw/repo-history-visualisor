import { dirname } from "path";
import { DirectoryData, FileData, LinkData } from "../components/NetworkDiagram";
import { FileChange } from "../RepositoryRepresentation";


export function removeDirectory(nodeData: DirectoryData[], links: any[], indexedFileClusters: { [key: string]: string[] }, dir: DirectoryData) {
    const index = nodeData.indexOf(dir);
    if (index === -1 || links.filter(n => n.source.name === dir.name).length !== 0 || (indexedFileClusters[dir.name] && indexedFileClusters[dir.name].length > 0)) {
        return;
    }

    // removing the directory
    nodeData.splice(index, 1);

    // removing all links to that directory
    links.filter(n => n.target.name === dir.name).forEach(link => {
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

export function getFileData(file: FileChange): FileData {
    const split = file.f.split("/");

    const name = split.pop()!;
    const dir = split.join("/");
    const color = getColorFromExtension(name.split(".").pop()!);

    return { name: name, directory: dir, color: color, changeType: file.t };
}

// caching colors so they do not need to be recalculated
const colorLookup: { [key: string]: string } = {};

function getColorFromExtension(str: string) {
    if (colorLookup[str]) {
        return colorLookup[str]
    }

    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colorLookup[str] = color;
    return color;

}