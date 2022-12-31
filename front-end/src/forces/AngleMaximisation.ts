import { Force, SimulationNodeDatum } from "d3-force";
import { LinkData, NodeData } from "../components/NetworkDiagram";
import { Vector } from "../utils/MathUtils";

interface coord {
    x: number,
    y: number,
}

interface AngleMaximisation<NodeData extends SimulationNodeDatum> extends Force<NodeData, LinkData> {
}

interface ExtendedNodeData extends NodeData {
    angle?: number,
}

// // used to maximise the angle between outgoing links on the graph
// export default function (nodes: NodeData[], links: LinkData[], id: (data: NodeData) => string, angleAllowance: number = 0.1) {
export default function angleMaximisation(links: LinkData[], id: (node: NodeData) => string, velocityMultiplier: number = 0.005, angleAllowance: number = 0.1): AngleMaximisation<NodeData> {
    let nodes: NodeData[];

    let sourceIndexedLinks: { [key: string]: string[] };
    let targetIndexedLinks: { [key: string]: string[] };
    let idIndexedNodes: { [key: string]: NodeData };
    /**
     * The force function that will be called by d3-force
     * @param time the time since last update
     */
    const force: AngleMaximisation<NodeData> = function (_: Number) {
        if (!nodes) {
            // should never happen as init should be called first, but will 
            throw new Error("Nodes must be set to update the force");
        }
        // updating all node positions
        nodes.forEach(node => {
            updateNodeData(node);
        });
    }

    force.initialize = function (initNodes: NodeData[], _) {
        nodes = initNodes;
        createIndexes();
    }

    /**
     * Create indexes for the set data
     */
    function createIndexes() {
        sourceIndexedLinks = {};
        targetIndexedLinks = {};
        idIndexedNodes = {};

        nodes.forEach(node => {
            idIndexedNodes[id(node)] = node;
        });

        links.forEach(link => {
            // adding to source and target indexed list
            sourceIndexedLinks[link.source] = [...sourceIndexedLinks[link.source] ?? "", link.target];
            targetIndexedLinks[link.target] = [...targetIndexedLinks[link.target] ?? "", link.source];
        });
    }

    /**
     *  used to get the source coords of the incomming edge into the node
     *  returns undefined if the input node does not have any coords (occurs on the first tick new nodes are added to the graph)
     *  returns [0, 0] if node has no root (currently disabled)
     */
    function getIncomingNodeCoords(node: NodeData): coord | undefined {
        let targetNodeStrs = targetIndexedLinks[id(node)];
        if (!targetNodeStrs || targetNodeStrs.length === 0) {
            // return { x: 0, y: 0 };
            return undefined;
        }
        let targetNodeStr = targetNodeStrs[0];

        let incomingNode = idIndexedNodes[targetNodeStr];


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
        const outgoingNodes: ExtendedNodeData[] = getOutgoingNodeData(node);
        if (!incomingOrUndefined || !outgoingNodes || outgoingNodes.length === 0) {
            return;
        }

        let incoming = incomingOrUndefined;
        const incomingVector = new Vector(incoming.x!, incoming.y!);

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

        // number of 360 / number of edges incoming and outgoing
        const angleGap = (Math.PI * 2) / (outgoingNodes.length + (incoming ? 1 : 0));
        let targetAngle = 0;
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
            outgoing.vx = tangentVector.x * velocityMultiplier * (angleDiff);
            outgoing.vy = tangentVector.y * velocityMultiplier * (angleDiff);

        });
    }

    return force;

}