import { useState } from "react";
import { createTickFunction, addCommitToQueue, renderLines } from "../RepositoryDataManager";
import { Repository } from "../RepositoryRepresentation";
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

const profileWidth = 24;
const profileHeight = 35;

/**
 * parent component to the network diagram to act as an overarching controller and reduce the complexity of individual components
 * @param props Properties for this network diagram
 * @returns the function
 */
export default function RepositoryVisualisor(props: RepositoryVisualisorProps) {

    const [nodes, setNodes] = useState<DirectoryData[]>([{ name: "" }]);
    const [links, setLinks] = useState<LinkData[]>([]);

    const [indexedFileClusters, setIndexedFileClusters] = useState<{ [key: string]: string[] }>({});
    const [fileClusters, setFileClusters] = useState<FileData[]>([]);

    const [contributors, setContributors] = useState<{ [name: string]: ContributorProps }>({});

    function addCommitData() {
        const clonedNodes = [...nodes];
        const clonedLinks = [...links];
        const clonedIndexedFileClusters = { ...indexedFileClusters };
        const clonedFileClusters = [...fileClusters];
        const clonedContributors = {...contributors};
        addCommitToQueue(50, 50, props.visData, clonedNodes, clonedLinks, clonedIndexedFileClusters, clonedFileClusters, clonedContributors);
        setNodes(clonedNodes);
        setLinks(clonedLinks);
        setIndexedFileClusters(clonedIndexedFileClusters);
        setFileClusters(clonedFileClusters);
        setContributors(clonedContributors);
    }

    function renderUsers(ctx: CanvasRenderingContext2D, globalScale: number) {
        ctx.font = (15 / globalScale) + "px Arial";
        ctx.fillStyle = "white";

        const width = profileWidth / globalScale;
        const height = profileHeight / globalScale;
        for (const [_, value] of Object.entries(contributors)) {
            if (value.x === undefined || value.y === undefined) {
                continue;
            }
            const x = value.x;
            const y = value.y;

            const image = document.getElementById("PROFILEPICTURE");
            if (image && image instanceof HTMLImageElement) {
                ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
                const measuredText = ctx.measureText(value.name);
                ctx.fillText(value.name, x - measuredText.width / 2, y + height);
            }
        }
    }

    function onRenderFramePre(ctx: CanvasRenderingContext2D, globalScale: number) {
    }

    function onRenderFramePost(ctx: CanvasRenderingContext2D, globalScale: number) {
        renderLines(ctx, globalScale, fileClusters, contributors);
        renderUsers(ctx, globalScale);
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
            setContributors
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
                onRenderFramePre={onRenderFramePre}
            />
            <div style={{ display: "none" }}>
                <img id="PROFILEPICTURE" src="profile.png" alt=""/>
            </div>
        </>
    );
}