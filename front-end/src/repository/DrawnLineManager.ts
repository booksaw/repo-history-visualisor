import { FileData } from "../components/NetworkDiagram";
import { ContributorProps } from "../components/RepositoryVisualisor";
import { EditLineConstants } from "../visualisation/VisualisationConstants";
import ScheduledChangeManager, { ScheduledChangesManager } from "./ScheduledChangeManager";

export interface DrawnLines {
    targetName: string,
    targetDirectory: string,
    color: string,
    contributor: string;
}

class DrawnLineManager {
    drawnLines: DrawnLines[] = [];
    changesManager: ScheduledChangesManager;

    constructor(changesManager: ScheduledChangesManager) {
        this.changesManager = changesManager;
    }

    addModifiedLine(fileData: FileData, displayChangesFor: number, contributor: string) {
        const lineDraw: DrawnLines = { targetDirectory: fileData.directory, targetName: fileData.name, color: EditLineConstants.MODIFIED_COLOR, contributor: contributor };
        this.addScheduledLine(lineDraw, displayChangesFor);
    }

    addAddedLine(fileData: FileData, displayChangesFor: number, contributor: string) {
        const lineDraw: DrawnLines = { targetDirectory: fileData.directory, targetName: fileData.name, color: EditLineConstants.ADDED_COLOR, contributor: contributor };
        this.addScheduledLine(lineDraw, displayChangesFor);
    }

    addRemovedLine(fileData: FileData, displayChangesFor: number, contributor: string) {
        const lineDraw: DrawnLines = { targetDirectory: fileData.directory, targetName: fileData.name, color: EditLineConstants.DELETED_COLOR, contributor: contributor };
        this.addScheduledLine(lineDraw, displayChangesFor);
    }

    addScheduledLine(line: DrawnLines, displayChangesFor: number) {
        this.drawnLines.push(line);

        this.changesManager.addDelayedChange({
            ticksUntilChange: displayChangesFor,
            applyChange: () => { this.removeLine(line); },
        });
    }

    

    removeLine(line: DrawnLines) {
        const index = this.drawnLines.indexOf(line);
        this.drawnLines.splice(index, 1);
    }

    renderLines(ctx: CanvasRenderingContext2D, globalScale: number, fileClusters: FileData[], contributors: { [name: string]: ContributorProps }) {

        this.drawnLines.forEach(line => {
            const targetLst = fileClusters.filter(fc => fc.name === line.targetName && fc.directory === line.targetDirectory);
            if (targetLst.length < 1) {
                return;
            }
            const target = targetLst[0];
            const source = contributors[line.contributor];

            if (target.x === undefined || target.y === undefined || !source || source.x === undefined || source.y === undefined) {
                return;
            }

            ctx.strokeStyle = line.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
        });

    }
}

export default new DrawnLineManager(ScheduledChangeManager);