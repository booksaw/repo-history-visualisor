import { DirectoryData, FileData, LinkData } from "../components/NetworkDiagram";
import { Vector } from "../utils/MathUtils";
import { StructureConstants } from "../visualisation/VisualisationConstants";
import { Structure } from "./RepositoryRepresentation";


class StructureManager {

    drawStructures(ctx: CanvasRenderingContext2D, globalScale: number, structures: Structure[], directories: DirectoryData[], links: LinkData[], files: FileData[]) {

        const indexedDirectories = this.indexDirectoryData(directories);

        structures.forEach(structure => {
            const minAndMax = this.getMinAndMax(structure.folder, indexedDirectories, links, files);
            if (!minAndMax) {
                // directory is not currently within visualisation
                return;
            }
            const { min, max } = minAndMax;

            StructureConstants.configureCtxToStructure(ctx, "#8a712d", "#574b2a");
            ctx.beginPath();
            ctx.rect(min.x - 5, min.y - 5, max.x - min.x + 10, max.y - min.y + 10 + (StructureConstants.fontSize / globalScale));
            ctx.fill();
            ctx.stroke();

            StructureConstants.configureCtxToText(ctx, globalScale);
            ctx.fillText(structure.label, min.x, max.y + (StructureConstants.fontSize / globalScale), max.x - min.x);

            
        });

    }

    private indexDirectoryData(directories: DirectoryData[]): { [dir: string]: DirectoryData } {

        const indexedDirectories: { [dir: string]: DirectoryData } = {};

        directories.forEach(dir => {
            indexedDirectories[dir.name] = dir;
        });

        return indexedDirectories;
    }

    private getMinAndMax(dir: string, directories: { [dir: string]: DirectoryData }, links: LinkData[], files: FileData[]): { min: Vector, max: Vector } | undefined {
        const currentDir = directories[dir];
        if (!currentDir) {
            return;
        }

        let minX: number | undefined = undefined;
        let maxX: number | undefined = undefined;
        let minY: number | undefined = undefined;
        let maxY: number | undefined = undefined;

        const filteredFiles = files.filter(file => file.directory === dir);  
        if (filteredFiles.length !== 0) {
            const radius = currentDir.radius ?? 10;
            minX = currentDir.x - radius;
            maxX = currentDir.x + radius;
            minY = currentDir.y - radius;
            maxY = currentDir.y + radius;
        }

        const filteredLinks = links.filter(link => link.getSourceName() === dir);

        filteredLinks.forEach(link => {
            const minAndMax = this.getMinAndMax(link.getTargetName(), directories, links, files);
            if (!minAndMax) {
                return;
            }

            if (minX === undefined || maxX === undefined || minY === undefined || maxY === undefined) {
                minX = minAndMax.min.x;
                minY = minAndMax.min.y;
                maxX = minAndMax.max.x;
                maxY = minAndMax.max.y;
            } else {
                minX = Math.min(minAndMax.min.x, minX);
                minY = Math.min(minAndMax.min.y, minY);
                maxX = Math.max(minAndMax.max.x, maxX);
                maxY = Math.max(minAndMax.max.y, maxY);
            }
        });

        if (minX === undefined || maxX === undefined || minY === undefined || maxY === undefined) {
            return;
        }
        return { min: new Vector(minX, minY), max: new Vector(maxX, maxY) };
    }

}

export default new StructureManager();
