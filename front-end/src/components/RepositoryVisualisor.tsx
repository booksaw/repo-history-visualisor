import { useState } from "react";
import { createTickFunction, addCommit, renderLines } from "../RepositoryDataManager";
import { Repository } from "../RepositoryRepresentation";
import NetworkDiagram, { DirectoryData, FileData, LinkData } from "./NetworkDiagram";

export interface RepositoryVisualisorProps {
    visData: Repository;
    debugMode?: boolean;
    showFullPathOnHover?: boolean;
    manualMode?: boolean;
}

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

    function addCommitData() {
        const clonedNodes = [...nodes];
        const clonedLinks = [...links];
        const clonedIndexedFileClusters = {...indexedFileClusters};
        const clonedFileClusters = [...fileClusters];
        addCommit(50, props.visData, clonedNodes, clonedLinks, clonedIndexedFileClusters, clonedFileClusters);
        setNodes(clonedNodes);
        setLinks(clonedLinks);
        setIndexedFileClusters(clonedIndexedFileClusters);
        setFileClusters(clonedFileClusters);
    }

    function onRenderFramePost(ctx: CanvasRenderingContext2D, globalScale: number) {
        renderLines(ctx, globalScale, fileClusters);
    }

    return (
        <NetworkDiagram
            showDirectories={props.debugMode}
            showFullPathOnHover={props.showFullPathOnHover}
            links={links}
            nodes={nodes}
            onClick={props.manualMode ? addCommitData : undefined}
            indexedFileClusters={indexedFileClusters}
            fileClusters={fileClusters}
            tick={createTickFunction(props.manualMode ? -1 : 200, 100, props.visData, [...nodes], setNodes, [...links], setLinks, {...indexedFileClusters}, setIndexedFileClusters, [...fileClusters], setFileClusters)}
            onRenderFramePost={onRenderFramePost}
        />
    );
}