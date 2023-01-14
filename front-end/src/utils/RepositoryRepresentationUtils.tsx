import { FileData, LinkData, NodeData } from "../components/NetworkDiagram";


export function addDirectory(nodeData: NodeData[], links: LinkData[], dir: NodeData) {
    // checking if this node exists
    if (nodeData.filter(n => n.name === dir.name).length !== 0 || dir.name.length === 0) {
        // if node exists, all parents exist and no processing is required
        return;
    }

    // adding parent directories
    const split = dir.name.split("/");
    split.pop();
    const parentName = split.join("/");
    if (parentName.length !== 0) {
        addDirectory(nodeData, links, { name: parentName });
    }

    // parent must now exist
    // but the dir does not already exist
    // pushing this directory
    nodeData.push(dir);
    // adding link
    links.push({ source: parentName, target: dir.name });
    // links.push({ source: "0", target: dir.name });
}

export function getFileData(file: string): FileData {
    const split = file.split("/");

    const name = split.pop()!;
    const dir = split.join("/");

    return { name: name, directory: dir };
}