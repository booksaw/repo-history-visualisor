/**
 * @jest-environment jsdom
 */

import { DirectoryData, LinkData } from "../../components/NetworkDiagram";
import { addDirectory, getModifiedFileData, removeDirectory } from "../../utils/RepositoryRepresentationUtils";

test("Test get file data", () => {
    const fd = getModifiedFileData({ file: "test/test.java", type: "A" });

    expect(fd).toEqual({ changeType: "A", fileData: { color: fd.fileData.color, name: "test.java", directory: "test", fileExtension: "java" } })
});


test("Test no file extension", () => {
    const fd = getModifiedFileData({ file: "test/test", type: "A" });

    expect(fd).toEqual({ changeType: "A", fileData: { color: fd.fileData.color, name: "test", directory: "test", fileExtension: "test" } })
});

test("Test adding a directory", () => {
    const nodeData: DirectoryData[] = [{ name: "", x: 0, y: 0 }];
    const links: LinkData[] = [];

    addDirectory(nodeData, links, "test");

    expect(nodeData.length).toEqual(2);
    expect(nodeData[1].name).toEqual("test");

    expect(links.length).toEqual(1);
    expect(links[0].target).toEqual("test");
});

test("Test removing a directory", () => {
    const dir = { name: "test", x: 0, y: 0 };
    let nodeData: DirectoryData[] = [{ name: "", x: 0, y: 0 }, dir];
    let links: LinkData[] = [new LinkData("", "test")];

    removeDirectory(nodeData, links, {}, dir);

    expect(nodeData.length).toEqual(1);
    expect(links.length).toEqual(0);
});