import { SimulationNodeDatum } from "d3";
import { useMemo, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { FileClusterLocations } from "../forces/ClusterFileCircles";


export interface NetworkDiagramProps {
    nodes: DirectoryData[];
    links: LinkData[];
    dimensions?: ScreenDimensions;
    indexedFileClusters: { [key: string]: string[] };
    fileClusters: FileData[];
    hideFiles?: boolean;
    showDirectories?: boolean;
    showFullPathOnHover?: boolean;
    onClick?: (e: any) => void;
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
  
  export interface LinkData {
    source: string;
    target: string;
  }
  
  export interface ScreenDimensions {
    width: number;
    height: number;
  }

export const svgParentID = "svg-parent";

export default function NetworkDiagram(props: NetworkDiagramProps) {


    const [idIndexedFlies, setIdIndexedFiles] = useState<{ [key: string]: FileData }>({});

    useMemo(() => {
        
        const newIdIndexedFlies: { [key: string]: FileData } = {};
        props.fileClusters.forEach(file => {
            newIdIndexedFlies[file.name] = file;
        });
        setIdIndexedFiles(newIdIndexedFlies);

    }, [props.fileClusters]);

    const data = { nodes: props.nodes, links: props.links };

    const fileClusterLocations = new FileClusterLocations();

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
        if(!index) {
            // cannot draw files if no files exist
            return;
        }

        index.forEach(file => {
            const positionVector = fileClusterLocations.getPositionVector(i);

            ctx.beginPath();
            ctx.fillStyle = idIndexedFlies[file].color;
            ctx.strokeStyle = idIndexedFlies[file].color;
            ctx.arc(node.x + positionVector.x, node.y + positionVector.y, fileClusterLocations.circleRadius, 0, 2 * Math.PI);
            ctx.fill();

            i++;
        })
    }

    return (
        <div id={svgParentID} onClick={props.onClick} style={{
            height: "100vh",
            width: "100%",
            marginRight: "0px",
            marginLeft: "0px",
        }}>
            <ForceGraph2D
                graphData={data}
                nodeId="name"
                linkColor={() => "white"}
                nodeCanvasObject={clusterCircles}
                onNodeHover={() => { }}

            />
        </div>

    )
}