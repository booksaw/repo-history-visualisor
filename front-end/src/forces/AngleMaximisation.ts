import { Force, SimulationNodeDatum } from "d3-force";
import { LinkData, NodeData } from "../components/NetworkDiagram";
import { coord, Vector } from "../utils/MathUtils";

interface ExtendedNodeData extends NodeData {
    angle?: number,
}

// // used to maximise the angle between outgoing links on the graph
// export default function (nodes: NodeData[], links: LinkData[], id: (data: NodeData) => string, angleAllowance: number = 0.1) {
export default function angleMaximisation(
    links: LinkData[],
    nodes: NodeData[],
    idIndexedNodes: { [key: string]: NodeData },
    id: (node: NodeData) => string,
    velocityMultiplier: number = 0.1,
    angleAllowance: number = 0.01
) {



    let sourceIndexedLinks: { [key: string]: string[] };
    let targetIndexedLinks: { [key: string]: string[] };

    createIndexes();

    /**
     * The force function that will be called by d3-force
     * @param time the time since last update
     */
    const force = function (_: Number) {
        if (!nodes) {
            // should never happen as init should be called first, but will 
            throw new Error("Nodes must be set to update the force");
        }
        // updating all node positions
        nodes.forEach(node => {
            updateNodeData(node);
        });
    }

    /**
     * Create indexes for the set data
     */
    function createIndexes() {
        sourceIndexedLinks = {};
        targetIndexedLinks = {};

        links.forEach(link => {
            // adding to source and target indexed list
            sourceIndexedLinks[link.getSourceName()] = [...sourceIndexedLinks[link.getSourceName()] ?? "", link.getTargetName()];
            targetIndexedLinks[link.getTargetName()] = [...targetIndexedLinks[link.getTargetName()] ?? "", link.getSourceName()];
        });
    }

    /**
     *  used to get the source coords of the incomming edge into the node
     *  returns undefined if the input node does not have any coords (occurs on the first tick new nodes are added to the graph)
     *  returns [0, 0] if node has no root (currently disabled)
     */
    function getIncomingNodeCoords(node: NodeData): coord | undefined {
        let targetNodeStrs = targetIndexedLinks[id(node)];
        // if there is no incoming node
        if (!targetNodeStrs || targetNodeStrs.length === 0) {
            return undefined;
        }
        let targetNodeStr = targetNodeStrs[0];

        let incomingNode = idIndexedNodes[targetNodeStr];

        // if the incoming node has invalid values assigned
        if (!incomingNode || !incomingNode.x || !incomingNode.y) {
            return undefined;
        }
        return { x: incomingNode.x, y: incomingNode.y };
    }

    function getOutgoingNodeData(node: NodeData): NodeData[] {
        let outgoing: NodeData[] = [];
        sourceIndexedLinks[id(node)]?.forEach((target) => {
            // only including nodes which have a posistion set
            let node = idIndexedNodes[target];
            if (node.x && node.y) {
                outgoing.push(node);
            }
        });
        return outgoing;
    }

    function updateNodeData(node: NodeData) {
        if (!node.x || !node.y) {
            return;
        }
        const nodeVector = new Vector(node.x!, node.y!);
        const incomingOrUndefined = getIncomingNodeCoords(node);
        let outgoingNodes: ExtendedNodeData[] = getOutgoingNodeData(node);
        if (outgoingNodes.length === 0) {
            //  if no outgoing nodes, do not need to adjust child nodes
            return;
        }

        let incomingVector: Vector;
        if (incomingOrUndefined) {
            incomingVector = new Vector(incomingOrUndefined.x, incomingOrUndefined.y);
        } else {
            // no need to organise the nodes of the root node has a single output
            if (outgoingNodes.length === 1) {
                return;
            }
            const forcedIncoming = outgoingNodes[0];
            incomingVector = new Vector(forcedIncoming.x!, forcedIncoming.y!);

            outgoingNodes.shift();

        }

        // const incomingVector = new Vector(0,0);

        // ordering outgoing edges by the angle of the incoming edge to the outgoing edge 
        // and storing the result to save recalculating later
        outgoingNodes.forEach((outgoing) => {
            // forcing outgoing to be defined as null checks have already been performed
            const outgoingVector = new Vector(outgoing.x!, outgoing.y!);

            const a = Vector.subtract(incomingVector, nodeVector);
            const b = Vector.subtract(outgoingVector, nodeVector);
            outgoing.angle = Vector.getAngleDifference(a, b);
        });

        // sorting the outgoing edges in increasing order from the angle
        // angle must have been set by this point
        outgoingNodes.sort((a, b) => a.angle! - b.angle!);

        let angleGap: number;
        let targetAngle: number;
        if (incomingOrUndefined) {
            // if there is an incomming node, displaying all the other nodes on the seperate side
            angleGap = (Math.PI) / (outgoingNodes.length + 1);
            targetAngle = Math.PI / 2
        } else {
            //     // if there are no incomming nodes (the root node) evenly distributing the outgoing nodes
            angleGap = (Math.PI * 2) / (outgoingNodes.length + 1);
            targetAngle = 0;
        }

        outgoingNodes.forEach((outgoing) => {
            // outgoing vector from the origin
            const outgoingVector = Vector.subtract(new Vector(outgoing.x!, outgoing.y!), nodeVector);

            targetAngle = targetAngle + angleGap;
            const angleDiff = targetAngle - outgoing.angle!;

            // if it is close enough to the ideal angle, skipping
            if (Math.abs(angleDiff) < angleAllowance) {
                return;
            }

            const mod = outgoingVector.modulus() * Math.sin(angleDiff);
            const arg = outgoingVector.argument() + ((mod > 0 ? 1 : -1) * (Math.PI / 2));
            const tangentVector = Vector.fromModArg(mod, arg);
            outgoing.vx = (outgoing.vx ?? 0) + tangentVector.x * velocityMultiplier * (angleDiff);
            outgoing.vy = (outgoing.vy ?? 0) + tangentVector.y * velocityMultiplier * (angleDiff);

        });
    }

    return force;

}