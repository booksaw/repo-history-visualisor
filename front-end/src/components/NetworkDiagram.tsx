import { forceManyBody, SimulationNodeDatum } from 'd3';
import { MutableRefObject, useEffect, useMemo, useState } from "react";
import ForceGraph2d, {
    ForceGraphMethods,
} from "react-force-graph-2d";
import angleMaximisation from '../forces/AngleMaximisation';
import { FileClusterLocations } from "../forces/ClusterFileCircles";
import Collide from '../forces/Collide';


export interface NetworkDiagramProps {
    nodes: DirectoryData[];
    links: LinkData[];
    indexedFileClusters: { [key: string]: string[] };
    fileClusters: FileData[];
    tick?: () => void;
    hideFiles?: boolean;
    showDirectories?: boolean;
    showFullPathOnHover?: boolean;
    onClick?: (e: any) => void;
    onRenderFramePost?: (canvasContext: CanvasRenderingContext2D, globalScale: number) => void;
    onRenderFramePre?: (canvasContext: CanvasRenderingContext2D, globalScale: number) => void;
    graphRef: MutableRefObject<ForceGraphMethods | undefined>;
    divRef: any;
}

export interface NodeData extends SimulationNodeDatum {
    name: string;
    fx?: number;
    fy?: number;
    radius?: number;
}

const maxRadChange = 0.01;

export interface FileData extends NodeData {
    directory: string;
    color: string;
    changeType: string;
}

export interface DirectoryData extends NodeData {
    x: number;
    y: number;
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

export const svgParentID = "svg-parent";
const fileClusterLocations = new FileClusterLocations()

export default function NetworkDiagram(props: NetworkDiagramProps) {

    const [idIndexedFlies, setIdIndexedFiles] = useState<{ [key: string]: FileData }>({});

    useEffect(() => {


        const current = props.graphRef.current!;

        const chargeForce = forceManyBody()
        chargeForce.strength(
            (node: any) => {
                // 0.5 * calculateWeight(node);

                return - 40;
            }
        );
        chargeForce.theta(0.1);

        current.d3Force('charge', chargeForce);

        const collideForce = Collide(
            (node: any) => {
                const files = props.indexedFileClusters[node.name];

                const currentRad: number | undefined = node.radius;
                const target = fileClusterLocations.getPositionRingId(files?.length ?? 0) * fileClusterLocations.circleRadius * 2;

                let diff = target - ((currentRad) ? currentRad : 0);

                if (Math.abs(diff) > maxRadChange && currentRad !== undefined) {
                    diff = (diff > 0) ? + maxRadChange : -maxRadChange;
                }
                const newRad = diff + (currentRad ? currentRad : 0);
                node.radius = newRad;
                return newRad;
            }
        );
        collideForce.iterations(10);
        collideForce.strength(0.005);
        current.d3Force("collide", collideForce);

        const idIndexedNodes: { [key: string]: NodeData } = {};

        props.nodes.forEach(node => {
            idIndexedNodes[node.name] = node;
        });

        current.d3Force("angleMax", angleMaximisation(
            props.links,
            props.nodes,
            idIndexedNodes,
            (f: NodeData) => f.name,
        ));


    }, [props.nodes, props.links, props.indexedFileClusters, props.graphRef])

    useMemo(() => {

        const newIdIndexedFlies: { [key: string]: FileData } = {};
        props.fileClusters.forEach(file => {
            newIdIndexedFlies[file.directory + "/" + file.name] = file;
        });
        setIdIndexedFiles(newIdIndexedFlies);

    }, [props.fileClusters]);


    const data = { nodes: props.nodes, links: props.links };


    const clusterCircles = function (node: any, ctx: CanvasRenderingContext2D, globalScale: number) {
        if (props.showDirectories) {
            ctx.beginPath();
            ctx.fillStyle = 'yellow';
            ctx.strokeStyle = "yellow"
            ctx.arc(node.x, node.y, node.radius ?? 1, 0, 2 * Math.PI);
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
            const fd = idIndexedFlies[node.name + "/" + file];

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
        if (!props.graphRef.current || props.nodes.length <= 1) {
            return
        }
        props.graphRef.current.zoomToFit(100, 100);
    }

    function onEngineTick() {

        if (props.tick) {
            props.tick();
        }

        zoomToFit();
    }

    return (
        <div id={svgParentID}
            ref={props.divRef}
            onClick={props.onClick}
            style={{
                height: "100vh",
                width: "100%",
                marginRight: "0px",
                marginLeft: "0px",
            }}>
            <ForceGraph2d
                ref={props.graphRef}
                graphData={data}
                nodeId="name"
                linkColor={() => "white"}
                nodeCanvasObject={clusterCircles}
                onEngineTick={onEngineTick}
                onRenderFramePost={props.onRenderFramePost}
                onRenderFramePre={props.onRenderFramePre}
            />
        </div>

    )
}