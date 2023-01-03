import { coord, Vector } from "../utils/MathUtils";
import { FileData, LinkData, NodeData } from "../components/NetworkDiagram";
import { Force, SimulationNodeDatum } from "d3-force";


interface ClusterFiles<NodeData extends SimulationNodeDatum> extends Force<NodeData, LinkData> {
}

const positionVectors: Vector[] = [];
let nextRTotal = 1;

export function clusterFiles(indexedFileClusters: { [key: string]: string[] }, fileClusters: FileData[], links: LinkData[], id: (node: NodeData) => string, circleRadius: number) {
    let directories: NodeData[];

    let targetIndexedLinks: { [key: string]: string[] };
    let idIndexedDirectories: { [key: string]: NodeData };
    let idIndexedFlies: { [key: string]: FileData };
    let circleOffset = circleRadius * Math.sqrt(2); 

    const force: ClusterFiles<NodeData> = function (_: Number) {

        for (let key in indexedFileClusters) {
            clusterNodes(key, indexedFileClusters[key]);

        }

    }

    force.initialize = function (initNodes: NodeData[], _) {
        directories = initNodes;
        createIndexes();
    }


    /**
     * Create indexes for the set data
     */
    function createIndexes() {
        targetIndexedLinks = {};
        idIndexedDirectories = {};
        idIndexedFlies = {};

        directories.forEach(directory => {
            idIndexedDirectories[id(directory)] = directory;
        });

        fileClusters.forEach(file => {
            idIndexedFlies[id(file)] = file;
        });

        links.forEach(link => {
            // adding to target indexed list
            targetIndexedLinks[link.target] = [...targetIndexedLinks[link.target] ?? "", link.source];
        });
    }

    /**
 *  used to get the source coords of the incomming edge into the node
 *  returns undefined if the input node does not have any coords (occurs on the first tick new nodes are added to the graph)
 *  returns [0, 0] if node has no root (currently disabled)
 */
    function getIncomingNodeCoords(node: string): coord | undefined {
        let targetNodeStrs = targetIndexedLinks[node];
        // if there is no incoming node
        if (!targetNodeStrs || targetNodeStrs.length === 0) {
            return undefined;
        }
        let targetNodeStr = targetNodeStrs[0];

        let incomingNode = idIndexedDirectories[targetNodeStr];

        // if the incoming node has invalid values assigned
        if (!incomingNode || !incomingNode.x || !incomingNode.y) {
            return undefined;
        }
        return { x: incomingNode.x, y: incomingNode.y };
    }

    function clusterNodes(directory: string, fileList: string[]) {
        const directoryNode = idIndexedDirectories[directory];
        if (!directoryNode || !directoryNode.x || !directoryNode.y) {
            // position has not been set for this directory
            return;
        }

        const directoryOrigin = new Vector(directoryNode.x, directoryNode.y);
        const incomingOrUndefined = getIncomingNodeCoords(directory);
        if (!incomingOrUndefined) {
            // skipping root for now
            return;
        }

        const transitionVector = Vector.subtract(directoryOrigin, new Vector(incomingOrUndefined.x!, incomingOrUndefined.y!));

        // if (fileList.length === 1) {
        //     individualFile(idIndexedFlies[fileList[0]], directoryOrigin);
        // } else if (fileList.length === 2) {
        //     twoFiles(fileList, directoryOrigin, transitionVector)
        // } else {
            multipleFiles(fileList, directoryOrigin, transitionVector);
        // }
    }

    function individualFile(file: FileData, inputVectorOrigin: Vector) {
        file.x = inputVectorOrigin.x;
        file.y = inputVectorOrigin.y;
    }

    function twoFiles(files: string[], inputVectorOrigin: Vector, transitionVector: Vector) {

        let angle = Math.PI / 2;

        files.forEach(file => {
            const fileNode = idIndexedFlies[file];
            const mod = circleRadius;
            const arg = angle + transitionVector.argument();
            const tangentVector = Vector.fromModArg(mod, arg);
            const tangentVectorOrigin = Vector.add(tangentVector, inputVectorOrigin);
            
            fileNode.x = tangentVectorOrigin.x;
            fileNode.y = tangentVectorOrigin.y;

            angle += Math.PI;
        })
    }

    function multipleFiles(files: string[], inputVectorOrigin: Vector, transitionVector: Vector){
        let i = 0;

        files.forEach(file => {

            const positionVector = getPositionVector(i);

            const fileNode = idIndexedFlies[file];
            const positionVectorOrigin = Vector.add(positionVector, inputVectorOrigin);
            
            fileNode.x = positionVectorOrigin.x;
            fileNode.y = positionVectorOrigin.y;

            // incrementing the intended position
            i += 1;
        });

    }

    function getPositionVector(position: number): Vector {
        if(positionVectors[position]) {
            // if the vector has already been calculated, apply it
            return positionVectors[position];
        }
        
        // recursively calling this method until the position is calculated, 
        // done so if multiple position vectors need adding to the dict, they can be added individually
        addNextPositionRing();
        return getPositionVector(position);

    }

    function addNextPositionRing() {

        for(let i = nextRTotal; i > 0; i--) {
            const reverse = (nextRTotal - i) * circleOffset;
            const source = i * circleOffset;
            positionVectors.push(new Vector(source, reverse));
            positionVectors.push(new Vector(-source, -reverse));
            positionVectors.push(new Vector(-reverse, source));
            positionVectors.push(new Vector(reverse, -source));
        }


        nextRTotal += 2;
    }

    return force;

}
