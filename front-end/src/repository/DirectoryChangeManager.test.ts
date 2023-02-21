import { DirectoryData, FileData, LinkData } from "../components/NetworkDiagram";
import DirectoryChangeManager from "./DirectoryChangeManager";

test("Test adding a node", () => {
    const fd: FileData = {name: "test", directory: "test", changeType: "M", color: ""};
    const fileClusters: FileData[] = [];
    const indexedFileClusters: { [key: string]: string[] }= {}; 
    const nodes: DirectoryData[] = [{name: "", x: 0, y: 0}];
    const links: LinkData[] = [];

    DirectoryChangeManager.addNode(fd, fileClusters, indexedFileClusters, nodes, links, 1, "cont");

    expect(fileClusters.length).toEqual(1);
    expect(nodes.length).toEqual(2);
    expect(links.length).toEqual(1);

});

test("Test removing a node", () => {
    const fd: FileData = {name: "test", directory: "test", changeType: "M", color: ""};
    const fileClusters: FileData[] = [fd];
    const indexedFileClusters: { [key: string]: string[] }= {"test": ["test"]}; 
    const nodes: DirectoryData[] = [{name: "", x: 0, y: 0}, {name: "test", x: 0, y: 0}];
    const links: LinkData[] = [new LinkData("", "test")];

    DirectoryChangeManager.removeNode(fd, fileClusters, indexedFileClusters, nodes, links);

    expect(fileClusters.length).toEqual(0);
    expect(nodes.length).toEqual(1);
    expect(links.length).toEqual(0);
});