/**
 * used to control the length of edges within the diagram
 */
import * as d3 from 'd3';
import { Force } from 'd3-force';
import { LinkData, NodeData } from "../components/NetworkDiagram";
import { Vector } from '../utils/MathUtils';

interface EdgeLengthForce<NodeData extends d3.SimulationNodeDatum> extends Force<NodeData, LinkData> {
}


export default function edgeLengthForce(
        links: LinkData[], 
        id: (node: NodeData) => string, 
        velocityMultiplier: number = 0.5, 
        targetLength: number = 1, 
        lengthAllowance: number = 0.05,
    ): EdgeLengthForce<NodeData> {

    let nodes: NodeData[];
    let targetLengthSquared = targetLength ** 2;
    let lengthAllowanceSquared = lengthAllowance ** 2;

    let idIndexedNodes: { [key: string]: NodeData };
    
    /**
     * The force function that will be called by d3-force
     * @param time the time since last update
     */
    const force: EdgeLengthForce<NodeData> = function (_: Number) {
        links.forEach(link => {
            const source = idIndexedNodes[link.source];
            const target = idIndexedNodes[link.target];

            // verifying both nodes have valid locations
            if(!source.x || !source.y || !target.x || !target.y) {
                return;
            }
            // the current vector from source -> target
            const currentVec = new Vector(target.x! - source.x!, target.y! - source.y!); 
            const modSquared = currentVec.modulusSquared();
            const diffSquared = targetLengthSquared - modSquared;

            // length is close enough to the target that it is accepted
            if(Math.abs(diffSquared) < lengthAllowanceSquared) {
                return;
            }

            // calculate the velocity to apply
            const scaler = targetLengthSquared / modSquared;
            currentVec.scale(scaler * velocityMultiplier);

            // applying the velocity
            target.vx = target.vx  ?? 0 + currentVec.x;
            target.vy = target.vy  ?? 0 + currentVec.y;

        })
    }

    force.initialize = function (initNodes: NodeData[], _) {
        nodes = initNodes;
        createIndexes();
    }

    function createIndexes() {
        idIndexedNodes = {};

        nodes.forEach(node => {
            idIndexedNodes[id(node)] = node;
        });
    }

    return force;
}
