import { useRef, useState } from "react";
import { ForceGraphMethods } from "react-force-graph-2d";
import DrawnLineManager from "../repository/DrawnLineManager";
import FileColorManager from "../repository/FileColorManager";
import RepositoryDataManager from "../repository/RepositoryDataManager";
import { Milestone } from "../repository/RepositoryRepresentation";
import StructureManager from "../repository/StructureManager";
import { ValueSetterCombo, VisualisationVariableManager } from "../repository/VisualisationVariableManager";
import { CommitDateConstants, ContributorDisplayConstants, FileKeyConstants, MilestoneConstants } from "../visualisation/VisualisationConstants";
import { SpeedOptions, VisualisationSpeedOptions } from "../visualisation/VisualisationSpeedOptions";
import NetworkDiagram, { DirectoryData, FileData, LinkData } from "./NetworkDiagram";

export interface RepositoryVisualisorProps {
    repoDataManager: RepositoryDataManager;
    debugMode?: boolean;
    showFullPathOnHover?: boolean;
    visSpeed: VisualisationSpeedOptions;
    hideKey?: boolean;
}

export interface ContributorProps {
    name: string;
    x: number;
    y: number;
    commitsSinceLastContribution: number,
}

/**
 * parent component to the network diagram to act as an overarching controller and reduce the complexity of individual components
 * @param props Properties for this network diagram
 * @returns the function
 */
export default function RepositoryVisualisor(props: RepositoryVisualisorProps) {

    const [nodes, setNodes] = useState<DirectoryData[]>([{ name: "", x: 0, y: 0 }]);
    const [links, setLinks] = useState<LinkData[]>([]);

    const [indexedFileClusters, setIndexedFileClusters] = useState<{ [key: string]: string[] }>({});
    const [fileClusters, setFileClusters] = useState<FileData[]>([]);

    const [contributors, setContributors] = useState<{ [name: string]: ContributorProps }>({});
    const [date, setDate] = useState<number | undefined>();
    const [currentMilestone, setCurrentMilestone] = useState<Milestone | undefined>();


    const graphRef = useRef<ForceGraphMethods>();
    const divRef = useRef<HTMLDivElement>()

    const variableManager: VisualisationVariableManager = new VisualisationVariableManager({
        nodes: new ValueSetterCombo([...nodes], setNodes),
        links: new ValueSetterCombo([...links], setLinks),
        indexedFileClusters: new ValueSetterCombo({ ...indexedFileClusters }, setIndexedFileClusters),
        fileClusters: new ValueSetterCombo([...fileClusters], setFileClusters),
        contributors: new ValueSetterCombo({ ...contributors }, setContributors),
        date: new ValueSetterCombo(date, setDate),
        milestone: new ValueSetterCombo(currentMilestone, setCurrentMilestone),
        screenHeight: (divRef.current) ? divRef.current.offsetHeight : 0,
    });

    function addCommitData() {
        props.repoDataManager.addCommitToQueue(SpeedOptions.MANUAL, variableManager.props);
        variableManager.triggerSetters();
    }

    function renderUsers(ctx: CanvasRenderingContext2D, globalScale: number) {
        ContributorDisplayConstants.configureCtxToUser(ctx, globalScale);

        const { width, height } = ContributorDisplayConstants.getProfileDimensions(globalScale);

        // eslint-disable-next-line
        for (const [_, value] of Object.entries(contributors)) {
            if (value.x === undefined || value.y === undefined) {
                continue;
            }
            const { x, y } = value;

            const image = document.getElementById("MISSINGPROFILEPICTURE");
            if (image && image instanceof HTMLImageElement) {
                ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
                const measuredText = ctx.measureText(value.name);
                ctx.fillText(value.name, x - measuredText.width / 2, y + height);
            }
        }
    }

    function onRenderFramePre(ctx: CanvasRenderingContext2D, globalScale: number) {
        StructureManager.drawStructures(ctx, globalScale, props.repoDataManager.activeStructures, nodes, links, fileClusters);
    }

    function onRenderFramePost(ctx: CanvasRenderingContext2D, globalScale: number) {
        DrawnLineManager.renderLines(ctx, globalScale, fileClusters, contributors);
        renderUsers(ctx, globalScale);
        displayCommitDate(ctx, globalScale);
        displayMilestones(ctx, globalScale);

        if (!props.hideKey) {
            displayFileTypeKey(ctx, globalScale);
        }
    }

    function displayCommitDate(ctx: CanvasRenderingContext2D, globalScale: number) {
        CommitDateConstants.configureCtxToDate(ctx, globalScale);

        if (!graphRef.current || !divRef.current || !date) {
            return;
        }

        const width = divRef.current.offsetWidth;
        const height = divRef.current.offsetHeight
        const datetime = CommitDateConstants.getFormattedTimeFromUNIXSeconds(date);
        const measuredText = ctx.measureText(datetime);

        const coords = graphRef.current.screen2GraphCoords((width / 2), height - CommitDateConstants.bottomOffset);
        ctx.fillText(datetime, coords.x - (measuredText.width / 2), coords.y);
    }

    function displayFileTypeKey(ctx: CanvasRenderingContext2D, globalScale: number) {
        FileKeyConstants.configureCtxToFileKey(ctx, globalScale);
        const files: { extension: string, count: number }[] = [];

        fileClusters.forEach(file => {

            const extensionValue = files.filter(extension => extension.extension === file.fileExtension);
            if (extensionValue.length > 0) {
                extensionValue[0].count += 1;
                return;
            }

            files.push({ extension: file.fileExtension, count: 1 });
        })


        if (!graphRef.current || !divRef.current || !files || files.length === 0) {
            return;
        }

        files.sort((f1, f2) => {
            return f2.count - f1.count;
        })

        const coords = graphRef.current.screen2GraphCoords(FileKeyConstants.topOffset, FileKeyConstants.topOffset);
        ctx.beginPath();
        ctx.roundRect(coords.x, coords.y, 100 / globalScale, (files.length + 1) * 14 / globalScale, 10 / globalScale);
        ctx.fill();
        ctx.stroke();

        let index = 0;
        files.forEach(file => {
            const lineCoords = graphRef.current!.screen2GraphCoords(FileKeyConstants.topOffset + 7, FileKeyConstants.topOffset + 14 + (index * 14));
            ctx.fillStyle = FileColorManager.colorLookup[file.extension];
            ctx.beginPath();
            ctx.arc(lineCoords.x, lineCoords.y, 4 / globalScale, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillText(file.extension, lineCoords.x + (12 / globalScale), lineCoords.y + (3 / globalScale));
            index += 1;
        })

    }

    function displayMilestones(ctx: CanvasRenderingContext2D, globalScale: number) {
        MilestoneConstants.configureCtxToMilestones(ctx, globalScale)

        if (!graphRef.current || !divRef.current || !date || !currentMilestone) {
            return;
        }
        const width = divRef.current.offsetWidth;
        const height = divRef.current.offsetHeight;
        const measuredText = ctx.measureText(currentMilestone.milestone);

        const coords = graphRef.current.screen2GraphCoords((width / 2), height - MilestoneConstants.bottomOffset);
        ctx.fillText(currentMilestone.milestone, coords.x - (measuredText.width / 2), coords.y);



        if (currentMilestone.displayFor === undefined) {
            currentMilestone.displayFor = 0;
        }

        if (currentMilestone.displayFor <= 0) {
            setCurrentMilestone(undefined);
            return;
        }

        currentMilestone.displayFor -= 1;

    }



    const tickFunction =
        variableManager.getTickFunction(props.repoDataManager.getProcessVisDataFunction(
            props.visSpeed
        ));


    return (
        <>
            <NetworkDiagram
                showDirectories={props.debugMode}
                showFullPathOnHover={props.showFullPathOnHover}
                links={links}
                nodes={nodes}
                onClick={props.visSpeed === SpeedOptions.MANUAL ? addCommitData : undefined}
                indexedFileClusters={indexedFileClusters}
                fileClusters={fileClusters}
                tick={tickFunction}
                onRenderFramePost={onRenderFramePost}
                onRenderFramePre={onRenderFramePre}
                graphRef={graphRef}
                divRef={divRef}
            />
            <div style={{ display: "none" }}>
                <img id="MISSINGPROFILEPICTURE" src="profile.png" alt="" />
            </div>
        </>
    );
}