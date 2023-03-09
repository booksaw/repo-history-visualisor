import { FileData } from "../components/NetworkDiagram";
import ClusterFileCircles from "../visualisation/ClusterFileCircles";
import { FileLabelConstants } from "../visualisation/VisualisationConstants";


class FileLabelManager {

    files: FileData[] = [];

    addFile(data: FileData) {
        this.files.push(data);
    }

    removeFile(data: FileData) {
        const index = this.files.indexOf(data);
        if (index !== -1) {
            this.files.splice(index, 1);
        }
    }

    renderLines(ctx: CanvasRenderingContext2D, globalScale: number, fileData: FileData[]) {

        FileLabelConstants.configureCtxToText(ctx);
        this.files.forEach(fd => {
            const filteredfd = fileData.filter(file => file.directory === fd.directory && fd.name === file.name);

            if(filteredfd.length === 0) {
                return;
            }
            const filteredFile = filteredfd[0];

            if (filteredFile.x === undefined || filteredFile.y === undefined) {
                return;
            }
            ctx.fillText(fd.name, filteredFile.x + (ClusterFileCircles.circleRadius), filteredFile.y + (ClusterFileCircles.circleRadius / 2));
        });

    }

}

export default new FileLabelManager();