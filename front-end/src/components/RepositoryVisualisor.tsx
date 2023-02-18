import { useRef, useState } from "react";
import { ForceGraphMethods } from "react-force-graph-2d";
import { createTickFunction, addCommitToQueue, renderLines } from "../repository/RepositoryDataManager";
import { Repository } from "../repository/RepositoryRepresentation";
import { CommitDateConstants, ContributorDisplayConstants, MilestoneConstants } from "../visualisation/VisualisationConstants";
import NetworkDiagram, { DirectoryData, FileData, LinkData } from "./NetworkDiagram";

export interface RepositoryVisualisorProps {
    visData: Repository;
    debugMode?: boolean;
    showFullPathOnHover?: boolean;
    manualMode?: boolean;
}

export interface ContributorProps {
    name: string;
    x: number;
    y: number;
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
    const [currentMilestone, setCurrentMilestone] = useState<string | undefined>();

    const graphRef = useRef<ForceGraphMethods>();
    const divRef = useRef<HTMLDivElement>()

    function addCommitData() {
        const clonedNodes = [...nodes];
        const clonedLinks = [...links];
        const clonedIndexedFileClusters = { ...indexedFileClusters };
        const clonedFileClusters = [...fileClusters];
        const clonedContributors = { ...contributors };
        const commitResponse = addCommitToQueue(50, 50, props.visData, clonedNodes, clonedLinks, clonedIndexedFileClusters, clonedFileClusters, clonedContributors);
        setNodes(clonedNodes);
        setLinks(clonedLinks);
        setIndexedFileClusters(clonedIndexedFileClusters);
        setFileClusters(clonedFileClusters);
        setContributors(clonedContributors);
        if (commitResponse) {
            setDate(commitResponse.date)
            if (commitResponse.milestone) {
                setCurrentMilestone(commitResponse.milestone);
            }
        }
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

    // function onRenderFramePre(ctx: CanvasRenderingContext2D, globalScale: number) {
    // }

    function onRenderFramePost(ctx: CanvasRenderingContext2D, globalScale: number) {
        renderLines(ctx, globalScale, fileClusters, contributors);
        renderUsers(ctx, globalScale);
        displayCommitDate(ctx, globalScale);
        displayMilestones(ctx, globalScale);
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

    function displayMilestones(ctx: CanvasRenderingContext2D, globalScale: number) {
        MilestoneConstants.configureCtxToMilestones(ctx, globalScale)

        if (!graphRef.current || !divRef.current || !date || !currentMilestone) {
            return;
        }
        const width = divRef.current.offsetWidth;
        const height = divRef.current.offsetHeight;
        const measuredText = ctx.measureText(currentMilestone);

        const coords = graphRef.current.screen2GraphCoords((width / 2), height - MilestoneConstants.bottomOffset);
        ctx.fillText(currentMilestone, coords.x - (measuredText.width / 2), coords.y);
    }

    const tickFunction =
        createTickFunction(
            props.manualMode ? -1 : 200,
            100,
            50,
            props.visData,
            [...nodes],
            setNodes,
            [...links],
            setLinks,
            { ...indexedFileClusters },
            setIndexedFileClusters,
            [...fileClusters],
            setFileClusters,
            { ...contributors },
            setContributors,
            setDate,
            setCurrentMilestone
        )

    return (
        <>
            <NetworkDiagram
                showDirectories={props.debugMode}
                showFullPathOnHover={props.showFullPathOnHover}
                links={links}
                nodes={nodes}
                onClick={props.manualMode ? addCommitData : undefined}
                indexedFileClusters={indexedFileClusters}
                fileClusters={fileClusters}
                tick={tickFunction}
                onRenderFramePost={onRenderFramePost}
                // onRenderFramePre={onRenderFramePre}
                graphRef={graphRef}
                divRef={divRef}
            />
            <div style={{ display: "none" }}>
                <img id="MISSINGPROFILEPICTURE" src="profile.png" alt="" />
            </div>
        </>
    );
}