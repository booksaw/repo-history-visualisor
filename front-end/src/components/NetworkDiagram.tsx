import { useD3 } from '../hooks/useD3';
import { useMemo } from 'react';
import * as d3 from 'd3';
import { useState } from 'react';
import { SimulationNodeDatum } from 'd3';
import angleMaximisation from '../forces/AngleMaximisation';
import drag from '../dragControls';
import { AutoZoom } from '../autoZoom';

export default interface NetworkDiagramProps {
  width?: number;
  height?: number;
}

export interface NodeData extends SimulationNodeDatum {
  name: string;
}

export interface LinkData {
  source: string;
  target: string;
}

export const svgClasses: string[] = ["tree-edge", "tree-node"];

export default function NetworkDiagram() {

  const [svg, setSvg] = useState<any>();
  const [nodes, setNodes] = useState<NodeData[]>([{ name: "0" }, { name: "1" }, { name: "2" }, { name: "3" }]);
  const [links, setLinks] = useState<LinkData[]>([{ source: "0", target: "1" }, { source: "1", target: "2" }, { source: "1", target: "3" }]);
  const simulation: d3.Simulation<NodeData, undefined> = d3.forceSimulation();
  let linksClone: { source: string; target: string; }[] | undefined;


  // const width = props.width ?? 500;
  // const height = props.height ?? 300;
  const width = 500;
  const height = 300;

  const ref = useD3(
    (refSvg) => {

      refSvg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "width: 100%; height: 100vh");

      setSvg(refSvg);
    }, []);


  useMemo(() => {
    if (!svg) {
      return;
    }
    // setting the dimensions of the view box

    const N = d3.map(nodes, ({ name }) => name);

    linksClone = links.map((j) => ({ source: j["source"], target: j["target"] }));
    // const linksClone = links;
    // construct the forces
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(linksClone).id((d: any) => d.name); // need a link strength that increases strength with overall number of nodes 
    // https://github.com/d3/d3-force#link_strength
    // the force simulation 
    simulation.nodes(nodes)
      .on("tick", ticked)
      .force("link", forceLink)
      .force("charge", forceNode)
      .force("center", d3.forceCenter())
      .force("angleMaximisation", angleMaximisation(links, (n: NodeData) => n.name))


    svg
      .attr("stroke-opacity", 1)
      .attr("fill", "steelblue");

    // setting the edge color
    svg.select(".tree-edge").attr("stroke", "#ffffff");

    let link = svg.select(".tree-edge").selectAll("line").data(linksClone);
    const linkEnter = link.enter().append("line");
    link = linkEnter.merge(link);
    link.exit().remove();

    let node = svg.select(".tree-node").selectAll("circle").data(nodes);
    let nodeEnter = node.enter().append("circle")
      .attr("r", 5)
      .call(drag(simulation));
    node = nodeEnter.merge(node);
    node.exit().remove();


    function ticked() {
      if (!svg) return;
      svg.select(".tree-edge")
        .selectAll("line")
        .attr("x1", function (d: any) { return d.source.x })
        .attr("y1", (d: { source: { y: number; }; }) => d.source.y)
        .attr("x2", (d: { target: { x: number; }; }) => d.target.x)
        .attr("y2", (d: { target: { y: number; }; }) => d.target.y);

      svg.select(".tree-node")
        .selectAll("circle")
        .attr("cx", (d: { x: number; }) => d.x)
        .attr("cy", (d: { y: number; }) => d.y);
    }

    const autoZoom = new AutoZoom(svg);
    autoZoom.registerManualZoomControls();
    

  }, [svg, links, nodes]);

  function click() {
    const id = nodes.length;
    setNodes([...nodes, { name: id.toString() }]);
    setLinks([...links, { source: Math.floor(Math.random() * id).toString(), target: id.toString() }]);
  }

  return (
    <div onClick={() => click()}>
      <svg
        ref={ref}
        style={{
          height: "100vh",
          width: "100%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      >
        {
          svgClasses.map(svgClass => 
            <g className={svgClass} />
          )
        }
      </svg>
    </div>
  );
}
