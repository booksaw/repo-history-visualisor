import { DirectoryData } from "../components/NetworkDiagram";
import constant from "./constant";
import jiggle from "./jiggle";


export function calculateWeight(node: DirectoryData) {
  const length = node.name.split("/").length;
  if (length === 0) {
    return 1;
  }
  return 1 + (1 / length);
}

export default function Collide(radius: any) {
  let nodes: any,
    radii: any,
    random: any,
    strength = 1,
    iterations = 1;

  if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

  function force() {
    let n: number = nodes.length;
    // let tree: any;
    let node: any;
    let xi: number;
    let yi: number;
    let ri: number;

    for (let k = 0; k < iterations; ++k) {
      // tree = d3.quadtree(nodes, xf, yf).visitAfter(prepare);

      for (let i = 0; i < n; i++) {
        node = nodes[i];
        ri = radii[node.index];
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        // tree.visit(apply);
        for (let j = 0; j < n; j++) {
          if (j <= i) {
            continue;
          }
          apply(nodes[j])
        }
      }
    }



    function apply(data: DirectoryData) {
      // let data = quad.data;
      // if radius is null, initing it to be its base value
      let rj = data.radius ?? 0;
      let r = ri + rj;

      if (data.x !== undefined && data.y !== undefined) {
        if (data.vx === undefined) { data.vx = 0 }
        if (data.vy === undefined) { data.vy = 0 }
        // difference in next position of the 2 points 
        let x = xi - data.x - data.vx;
        let y = yi - data.y - data.vy;

        // distance between the 2 point centers (squared)
        let l = x * x + y * y;

        // if the 2 radius are intercepting (r = distance between circle centers)
        if (l < r * r) {

          // if they are on top of each other, randomly assigning an x difference to stop them breaking everything
          if (x === 0) {
            x = jiggle(random);
            l += x * x;
          }
          if (y === 0) {
            y = jiggle(random);
            l += y * y;
          }

          // l = (ideal distance between circles  - current distance between circles) / (current distance between circles * strength)
          // l is now the distance required to move (ie change required / dampening)
          // dampening will increase the greater the distance, so the greater the distance the greater the dampning effect????
          l = (r - (l = Math.sqrt(l))) * strength;

          // this is the difference between the points * distance to move
          const cx = x * l;
          const cy = y * l;

          const nodeWeight = calculateWeight(node);
          const dataWeight = calculateWeight(data);
          const totWeight = dataWeight + nodeWeight;
          node.vx += cx * (dataWeight / totWeight);
          node.vy += cy * (dataWeight / totWeight);
          data.vx -= cx * (nodeWeight / totWeight);
          data.vy -= cy * (nodeWeight / totWeight);
          const MAXV = 2;
          if (Math.abs(node.vx) > MAXV) {
            node.vx = MAXV * ((node.vx > 0) ? 1 : -1);
          }
          if (Math.abs(node.vy) > MAXV) {
            node.vy = MAXV * ((node.vy > 0) ? 1 : -1);
          }


          if (Math.abs(data.vx) > MAXV) {
            data.vx = MAXV * ((data.vx > 0) ? 1 : -1);
          }
          if (Math.abs(data.vy) > MAXV) {
            data.vy = MAXV * ((data.vy > 0) ? 1 : -1);
          }
        }
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    let i, n = nodes.length, node;
    radii = new Array(n);
    for (i = 0; i < n; ++i) {
      node = nodes[i];
      radii[node.index] = +radius(node, i, nodes);
    }
  }

  force.initialize = function (_nodes: any, _random: any) {
    nodes = _nodes;
    random = _random;
    initialize();
  };

  force.iterations = function (_: any) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function (_: any) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.radius = function (_: any) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
  };

  return force;
}