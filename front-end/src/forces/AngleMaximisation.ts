import { LinkData, NodeData } from "../components/NetworkDiagram";
import { Vector } from "../utils/MathUtils";

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
    maxanglediff: number = 0.15,
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
    function getIncomingNode(node: NodeData): NodeData | undefined {
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
        return incomingNode;
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
        const incomingOrUndefined = getIncomingNode(node);
        let connectedNodes: ExtendedNodeData[] = getOutgoingNodeData(node);
        if(incomingOrUndefined) {
            connectedNodes.push(incomingOrUndefined);
        }

        if (connectedNodes.length <= 1) {
            //  if no outgoing nodes, do not need to adjust child nodes
            return;
        }


        // const incomingVector = new Vector(0,0);

        // ordering outgoing edges by the angle of the incoming edge to the outgoing edge 
        // and storing the result to save recalculating later
        const root = connectedNodes[0];
        const originRootVector = new Vector(root.x!, root.y!);
        const rootVector = Vector.subtract(originRootVector, nodeVector);
        connectedNodes.forEach((connected) => {
            if(connected === root) {
                connected.angle = 0; 
                return;
            }
            // forcing outgoing to be defined as null checks have already been performed
            const originConnectedVector = new Vector(connected.x!, connected.y!);
            
            const connectedVector = Vector.subtract(originConnectedVector, nodeVector);
            connected.angle = Vector.getAngleDifference(rootVector, connectedVector);
        });

        // sorting the outgoing edges in increasing order from the angle
        // angle must have been set by this point
        connectedNodes.sort((a, b) => a.angle! - b.angle!);

        for (let i = 0; i < connectedNodes.length; i++) {

            const a = connectedNodes[i];
            const b = connectedNodes[((i + 1 >= connectedNodes.length) ? 0 : i + 1)];

            // 2 nodes next to each other may need to be seperated
            const anglediff = a.angle! - b.angle!;
            if (Math.abs(anglediff) > maxanglediff) {
                continue;
            }
            console.log("pusing elements apart,", a);
            console.log("and ", b);
            console.log("angle diff = " + anglediff);
            const angleChange = (maxanglediff - anglediff) / 2;

            // need to project the nodes away from each other
            const outgoingA = Vector.subtract(new Vector(a.x!, a.y!), nodeVector);
            const outgoingB = Vector.subtract(new Vector(b.x!, b.y!), nodeVector);

            let mod = angleChange;
            let arg = outgoingA.argument() + ((mod > 0 ? 1 : -1) * (Math.PI / 2));
            let tangentVector = Vector.fromModArg(mod, arg);
            a.vx = (a.vx ?? 0) + tangentVector.x * velocityMultiplier;
            a.vy = (a.vy ?? 0) + tangentVector.y * velocityMultiplier;

            arg = outgoingB.argument() + ((mod > 0 ? 1 : -1) * (Math.PI / 2));
            tangentVector = Vector.fromModArg(mod, arg);
            b.vx = (b.vx ?? 0) - tangentVector.x * velocityMultiplier;
            b.vy = (b.vy ?? 0) - tangentVector.y * velocityMultiplier;


        }
    }

    return force;

}