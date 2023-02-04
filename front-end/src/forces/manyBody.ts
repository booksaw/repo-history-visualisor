import { quadtree } from "d3-quadtree";
import constant from "./constant";
import jiggle from "./jiggle";

function x(d: any) {
    return d.x;
}

function y(d: any) {
    return d.y;
}

export default function manyBody() {
    let nodes: any,
        node: any,
        random: any,
        alpha: any,
        strength: any = constant(-30),
        strengths: any,
        distanceMin2 = 1,
        distanceMax2 = Infinity,
        theta2 = 0.81;

    const force: any = function (_: any) {
        let i, n = nodes.length, tree = quadtree(nodes, x, y).visitAfter(accumulate);
        for (alpha = _, i = 0; i < n; ++i) {
            node = nodes[i];
            tree.visit(apply);
        }
    }

    function initialize() {
        if (!nodes) return;
        let i, n = nodes.length, node: { index: string | number; x: number; y: number; vx: number; vy: number; };
        strengths = new Array(n);
        for (i = 0; i < n; ++i) {
            node = nodes[i];
            strengths[node.index] = +strength(node, i, nodes);
        }
    }

    function accumulate(quad: any) {
        let strength = 0, q, c, weight = 0, x, y, i;

        // For internal nodes, accumulate forces from child quadrants.
        if (quad.length) {
            for (x = y = i = 0; i < 4; ++i) {
                if ((q = quad[i]) && (c = Math.abs(q.value))) {

                    console.log("q.value = ", q);
                    strength += q.value;
                    weight += c;
                    x += c * q.x;
                    y += c * q.y;
                }
            }
            quad.x = x / weight;
            quad.y = y / weight;
        }

        // For leaf nodes, accumulate forces from coincident quadrants.
        else {
            q = quad;
            q.x = q.data.x;
            q.y = q.data.y;
            do {
                strength += strengths[q.data.index];
            } while (q = q.next);
        }

        quad.value = strength;
    }

    function apply(quad: any, x1: any, _: any, x2: any) {
        if (!quad.value) return true;

        let x = quad.x - node.x,
            y = quad.y - node.y,
            w = x2 - x1,
            l = x * x + y * y;

        // Apply the Barnes-Hut approximation if possible.
        // Limit forces for very close nodes; randomize direction if coincident.
        if (w * w / theta2 < l) {
            if (l < distanceMax2) {
                if (x === 0) {
                    x = jiggle(random);
                    l += x * x;
                }
                if (y === 0) {
                    y = jiggle(random);
                    l += y * y;
                }
                if (l < distanceMin2) {
                    l = Math.sqrt(distanceMin2 * l);
                }
                node.vx += x * quad.value * alpha / l;
                node.vy += y * quad.value * alpha / l;
            }
            return true;
        }

        // Otherwise, process points directly.
        else if (quad.length || l >= distanceMax2) return;

        // Limit forces for very close nodes; randomize direction if coincident.
        if (quad.data !== node || quad.next) {
            if (x === 0) {
                x = jiggle(random);
                l += x * x;
            }
            if (y === 0) {
                y = jiggle(random);
                l += y * y;
            }
            if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        }

        do if (quad.data !== node) {
            w = strengths[quad.data.index] * alpha / l;
            node.vx += x * w;
            node.vy += y * w;
        } while (quad = quad.next);
    }

    force.initialize = function (_nodes: any, _random: any) {
        nodes = _nodes;
        random = _random;
        initialize();
    };

    force.strength = function (_: any) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.distanceMin = function (_: any) {
        return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
    };

    force.distanceMax = function (_: any) {
        return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
    };

    force.theta = function (_: any) {
        return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
    };

    return force;
}