/**
 * @jest-environment jsdom
 */

import { DirectoryData, LinkData } from "../../components/NetworkDiagram";
import { getColorFromExtension, getFileData, addDirectory, removeDirectory } from "../../utils/RepositoryRepresentationUtils";

test("Test consistent color of filetype", () => {
    const c1 = getColorFromExtension("java");
    const c2 = getColorFromExtension("java");

    expect(c1).toEqual(c2);
})

test("Test get file data", () => {
    const fd = getFileData({file: "test/test.java", type: "A"});

    expect(fd).toEqual({color: fd.color, name: "test.java", directory: "test", changeType: "A"})
});


test("Test no file extension", () => {
    const fd = getFileData({file: "test/test", type: "A"});

    expect(fd).toEqual({color: fd.color, name: "test", directory: "test", changeType: "A"})
});

test("Test adding a directory", () => {
    const nodeData: DirectoryData[] = [{name: "", x: 0, y: 0}];
    const links: LinkData[] = [];

    addDirectory(nodeData, links, "test");

    expect(nodeData.length).toEqual(2);
    expect(nodeData[1].name).toEqual("test");

    expect(links.length).toEqual(1);
    expect(links[0].target).toEqual("test");
});

test("Test removing a directory", () => {
    const dir = {name: "test", x: 0, y: 0};
    let nodeData: DirectoryData[] = [{name: "", x: 0, y: 0}, dir];
    let links: LinkData[] = [new LinkData("", "test")];
 
    removeDirectory(nodeData, links, {}, dir);

    expect(nodeData.length).toEqual(1);
    expect(links.length).toEqual(0);
});