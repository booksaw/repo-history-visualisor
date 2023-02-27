import { DirectoryData, FileData, LinkData } from "../../components/NetworkDiagram";
import { Structure } from "../../repository/RepositoryRepresentation";
import StructureManager from "../../repository/StructureManager";
import { StructureConstants } from "../../visualisation/VisualisationConstants";

beforeEach(() => {
    jest.resetAllMocks();
})
test("Test drawing structures", () => {

    jest.spyOn(StructureConstants, "configureCtxToStructure").mockImplementation();
    jest.spyOn(StructureConstants, "configureCtxToText").mockImplementation();
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    const rect = jest.spyOn(ctx, "rect");

    const structures = [{ folder: "src", label: "test" }];
    const directoryData = [{ name: "src", x: 10, y: 10, radius: 0 }];
    const fileData = [{name: "f", directory: "src", changeType: "A", color: "a"}];

    StructureManager.drawStructures(ctx, 1, structures, directoryData, [], fileData);

    expect(rect).toBeCalledTimes(1);
});

test("Test drawing ", () => {

    jest.spyOn(StructureConstants, "configureCtxToStructure").mockImplementation();
    jest.spyOn(StructureConstants, "configureCtxToText").mockImplementation();
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    const rect = jest.spyOn(ctx, "rect");

    const structures = [{ folder: "src", label: "test" }];
    const directoryData = [
        { name: "src", x: 10, y: 10, radius: 0 },
        { name: "src/foo", x: 20, y: 20, radius: 0 }
    ];
    const fileData = [
        {name: "f", directory: "src", changeType: "A", color: "a"}, 
        {name: "f", directory: "src/foo", changeType: "A", color: "a"}
    ];
    const links: LinkData[] = [new LinkData("src", "src/foo")];

    StructureManager.drawStructures(ctx, 1, structures, directoryData, [], fileData);

    expect(rect).toBeCalledTimes(1);
});


