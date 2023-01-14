import { coord, Vector } from "../utils/MathUtils";
import { FileData, LinkData, NodeData } from "../components/NetworkDiagram";
import { Force, SimulationNodeDatum } from "d3-force";


interface ClusterFiles<NodeData extends SimulationNodeDatum> extends Force<NodeData, LinkData> {
}

const positionVectors: Vector[] = [];
let nextRing = 0;

export function clusterFiles(indexedFileClusters: { [key: string]: string[] }, fileClusters: FileData[], links: LinkData[], id: (node: NodeData) => string, circleRadius: number) {
    let directories: NodeData[];

    let targetIndexedLinks: { [key: string]: string[] };
    let idIndexedDirectories: { [key: string]: NodeData };
    let idIndexedFlies: { [key: string]: FileData };
    let root3 = Math.sqrt(3);

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

        if (fileList.length === 1) {
            individualFile(idIndexedFlies[fileList[0]], directoryOrigin);
        // } else if (fileList.length === 2) {
        //     twoFiles(fileList, directoryOrigin, transitionVector)
        } else {
        multipleFiles(fileList, directoryOrigin);
        }
    }

    function individualFile(file: FileData, inputVectorOrigin: Vector) {
        file.x = inputVectorOrigin.x;
        file.y = inputVectorOrigin.y;
    }

    function multipleFiles(files: string[], inputVectorOrigin: Vector) {
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
        if (positionVectors[position]) {
            // if the vector has already been calculated, apply it
            return positionVectors[position];
        }

        // recursively calling this method until the position is calculated, 
        // done so if multiple position vectors need adding to the dict, they can be added individually
        addNextPositionRing();
        return getPositionVector(position);

    }

    function addNextPositionRing() {
        if (nextRing === 0) {
            positionVectors.push(new Vector(0, 0));
        }

        let posy = false;
        let posx = true;

        for (let i = 0; i < 6; i++) {
            let segRoute: Vector;
            if (i % 3 === 0) {
                // direct
                segRoute = new Vector(2 * nextRing * circleRadius * (posx ? 1 : -1), 0);
            } else {
                // offset rules (for diagonals)
                segRoute = new Vector(nextRing * circleRadius * (posx ? 1 : -1), root3 * nextRing * circleRadius * (posy ? 1 : -1));
            }

            for (let j = 0; j < nextRing; j++) {
                if (j != 0) {
                    // progressing to the next segment location
                    if (i !== 1 && i !== 4) {
                        // diagonal case
                        segRoute.x += (posy ? 1 : -1) * circleRadius;
                        segRoute.y += (posx ? -1 : 1) * circleRadius * root3;
                    } else {
                        // straight case
                        segRoute.x += (posy ? 1 : -1) * 2 * circleRadius;
                    }
                }
                positionVectors.push(segRoute.clone());
            }

            // moving posx and posy to the next position
            if (i === 1 || i === 4) {
                posx = !posx;
            }
            if (i === 2) {
                posy = !posy;
            }
        }


        nextRing += 1;
        console.log(positionVectors);
    }

    return force;

}
