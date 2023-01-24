import { forceManyBody, SimulationNodeDatum } from 'd3';
import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2d, {
    ForceGraphMethods,
} from "react-force-graph-2d";
import { FileClusterLocations } from "../forces/ClusterFileCircles";


export interface NetworkDiagramProps {
    nodes: DirectoryData[];
    links: LinkData[];
    dimensions?: ScreenDimensions;
    indexedFileClusters: { [key: string]: string[] };
    fileClusters: FileData[];
    tick?: () => void;
    hideFiles?: boolean;
    showDirectories?: boolean;
    showFullPathOnHover?: boolean;
    onClick?: (e: any) => void;
    onRenderFramePost?: (canvasContext: CanvasRenderingContext2D, globalScale: number) => void;
}

export interface NodeData extends SimulationNodeDatum {
    name: string;
    fx?: number;
    fy?: number
}

export interface FileData extends NodeData {
    directory: string;
    color: string;
}

export interface DirectoryData extends NodeData {
}

export class LinkData {

    private static getName(obj: string | NodeData) {
        if (typeof obj === "string") {
            return obj;
        } else {
            return obj.name;
        }
    }

    source: string | NodeData;
    target: string | NodeData;

    constructor(source: string, target: string) {
        this.source = source;
        this.target = target;
    }

    getSourceName() {
        return LinkData.getName(this.source);
    }

    getTargetName() {
        return LinkData.getName(this.target);
    }

}

export interface ScreenDimensions {
    width: number;
    height: number;
}

export const svgParentID = "svg-parent";

export default function NetworkDiagram(props: NetworkDiagramProps) {


    const [idIndexedFlies, setIdIndexedFiles] = useState<{ [key: string]: FileData }>({});

    const graphRef = useRef<ForceGraphMethods>();

    const fileClusterLocations = new FileClusterLocations();

    useEffect(() => {


        const current = graphRef.current!;

        const chargeForce = forceManyBody()
        chargeForce.strength(
            (node: any) => {
                const files = props.indexedFileClusters[node.name];
                return -2 - (fileClusterLocations.getPositionRingId(files?.length ?? 0) ** 3 * 4);
            }
        );

        current.d3Force('charge', chargeForce);


    }, [props.nodes, props.links])

    useMemo(() => {

        const newIdIndexedFlies: { [key: string]: FileData } = {};
        props.fileClusters.forEach(file => {
            newIdIndexedFlies[file.name] = file;
        });
        setIdIndexedFiles(newIdIndexedFlies);

    }, [props.fileClusters]);


    const data = { nodes: props.nodes, links: props.links };


    const clusterCircles = function (node: any, ctx: CanvasRenderingContext2D, globalScale: number) {
        if (props.showDirectories) {
            ctx.beginPath();
            ctx.fillStyle = 'yellow';
            ctx.strokeStyle = "yellow"
            ctx.arc(node.x, node.y, 1, 0, 2 * Math.PI);
            ctx.fill();
        }

        let i = 0;
        const index = props.indexedFileClusters[node.name];
        if (!index) {
            // cannot draw files if no files exist
            return;
        }

        index.forEach(file => {
            const positionVector = fileClusterLocations.getPositionVector(i);
            const fd = idIndexedFlies[file];
            ctx.beginPath();
            ctx.fillStyle = fd.color;
            ctx.strokeStyle = fd.color;
            ctx.arc(node.x + positionVector.x, node.y + positionVector.y, fileClusterLocations.circleRadius, 0, 2 * Math.PI);
            ctx.fill();
            // updating so modified lines can be drawn to this point
            fd.x = node.x + positionVector.x;
            fd.y = node.y + positionVector.y;
            i++;
        })
    }

    const zoomToFit = function () {
        if (!graphRef.current || props.nodes.length <= 1) {
            return
        }
        graphRef.current.zoomToFit(100, 100);
    }

    function onEngineTick() {

        if (props.tick) {
            props.tick();
        }

        zoomToFit();


    }

    return (
        <div id={svgParentID} onClick={props.onClick} style={{
            height: "100vh",
            width: "100%",
            marginRight: "0px",
            marginLeft: "0px",
        }}>
            <ForceGraph2d
                ref={graphRef}
                graphData={data}
                nodeId="name"
                linkColor={() => "white"}
                nodeCanvasObject={clusterCircles}
                onEngineTick={onEngineTick}
                onRenderFramePost={props.onRenderFramePost}
            />
        </div>

    )
}