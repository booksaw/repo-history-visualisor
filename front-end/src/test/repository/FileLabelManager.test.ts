import { FileData } from "../../components/NetworkDiagram"
import FileLabelManager from "../../repository/FileLabelManager"


test("Test adding and removing file label", () => {
    const fd: FileData = {name: "test", directory: "test", color: "", fileExtension: "test"};

    FileLabelManager.addFile(fd)

    expect(FileLabelManager.files).toHaveLength(1);

    FileLabelManager.removeFile(fd);

    expect(FileLabelManager.files).toHaveLength(0);
}) 