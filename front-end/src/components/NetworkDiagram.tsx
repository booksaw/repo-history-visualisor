import { useD3 } from '../hooks/useD3';
import { useMemo } from 'react';
import * as d3 from 'd3';
import { useState } from 'react';
import { index, SimulationNodeDatum } from 'd3';
import angleMaximisation from '../forces/AngleMaximisation';
import drag from '../dragControls';
import { AutoZoom } from '../autoZoom';
import edgeLengthForce from '../forces/EdgeLengthForce';
import { clusterFiles } from '../forces/ClusterFileCircles';

export interface NetworkDiagramProps {
  dimensions?: ScreenDimensions;
  hideFiles?: boolean;
  showDirectories?: boolean;
}

export interface NodeData extends SimulationNodeDatum {
  name: string;
}

export interface FileData extends NodeData {
  directory: string;
  filePosition?: number;
}

export interface LinkData {
  source: string;
  target: string;
}

export interface ScreenDimensions {
  width: number;
  height: number;
}

// list of all the classes used within the svg
export const svgClasses: string[] = ["tree-edge", "file-node", "tree-node"];
// the name of the parent DIV to the svg
export const svgParentID = "svg-parent";

export default function NetworkDiagram(props: NetworkDiagramProps) {

  const [svg, setSvg] = useState<any>();
  const [nodes, setNodes] = useState<NodeData[]>([{ name: "0" }, { name: "1" }, { name: "2" }, { name: "3" }]);
  const [indexedFileClusters, setIndexedFileClusters] = useState<{ [key: string]: string[] }>({"1": ["0", "1", "2"]});
  const [fileClusters, setFileClusters] = useState<FileData[]>([{ name: "0", directory: "1" }, { name: "1", directory: "1" }, { name: "2", directory: "1" }]);
  const [links, setLinks] = useState<LinkData[]>([{ source: "0", target: "1" }, { source: "1", target: "2" }, { source: "1", target: "3" }]);
  const [autoZoom, setAutoZoom] = useState<AutoZoom>();
  const [dimensions, setDimensions] = useState<ScreenDimensions>({ width: 500, height: 300 });
  const simulation: d3.Simulation<NodeData, undefined> = d3.forceSimulation();
  // let linksClone: { source: string; target: string; }[] | undefined;

  // deconstructing the props
  if (props.dimensions) {
    setDimensions(dimensions);
  }

  const ref = useD3(
    (refSvg) => {

      refSvg
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .attr("viewBox", [-dimensions.width / 2, -dimensions.height / 2, dimensions.width, dimensions.height])
        .attr("style", "width: 100%; height: 100vh");

      setSvg(refSvg);
    }, []);


  useMemo(() => {
    if (!svg) {
      return;
    }
    const fileRadius = 3;

    let linksClone = links.map((j) => ({ source: j["source"], target: j["target"] }));
    // const linksClone = links;
    // construct the forces
    const idFunction = (n: any) => n.name;
    const forceLink = d3.forceLink(linksClone).id(idFunction); // need a link strength that increases strength with overall number of nodes 
    // https://github.com/d3/d3-force#link_strength
    // the force simulation 
    simulation.nodes(nodes)
      .on("tick", ticked)
      .force("link", forceLink)
      .force("center", d3.forceCenter())
      .force("angleMaximisation", angleMaximisation(links, idFunction))
      .force("edgeLength", edgeLengthForce(links, idFunction))
      .force("clusterFiles", clusterFiles(indexedFileClusters, fileClusters, links, idFunction, fileRadius));


    svg
      .attr("stroke-opacity", 1)
      .attr("fill", "steelblue");

    // setting the edge color
    svg.select(".tree-edge").attr("stroke", "#ffffff");

    let link = svg.select(".tree-edge").selectAll("line").data(linksClone);
    const linkEnter = link.enter().append("line");
    link = linkEnter.merge(link);
    link.exit().remove();

    let node = svg.select(".file-node").selectAll("circle").data(fileClusters);
    let nodeEnter = node.enter().append("circle")
      .attr("r", (!props.hideFiles) ? fileRadius : 0)
    node = nodeEnter.merge(node);
    node.exit().remove();

    svg.select(".tree-node").attr("fill", "orange");
    node = svg.select(".tree-node").selectAll("circle").data(nodes);
    nodeEnter = node.enter().append("circle")
      .attr("r", (props.showDirectories) ? 1 : 0)
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

      if (!props.hideFiles) {
        // updating the files locations to the locations of the directories
        
      }

      svg.select(".file-node")
        .selectAll("circle")
        .attr("cx", (d: { x: number; }) => d.x)
        .attr("cy", (d: { y: number; }) => d.y);



      if (autoZoom) {
        autoZoom.zoomFit();
      }
    }


  }, [svg, links, nodes, simulation, autoZoom, fileClusters, props.hideFiles, props.showDirectories]);

  useMemo(() => {
    if (svg) {
      const autoZoom = new AutoZoom(svg, dimensions);
      autoZoom.registerManualZoomControls();


      setAutoZoom(autoZoom);
    }
  }, [svg, dimensions])


  function click(e: any) {
    let id = nodes.length;
    // setNodes([...nodes, { name: id.toString() }]);
    // setLinks([...links, { source: Math.floor(Math.random() * id).toString(), target: id.toString() }]);
    id = fileClusters.length;
    // const directory = Math.floor(Math.random() * id).toString();
    const directory = "1";
    setFileClusters([...fileClusters, {name: id.toString(), directory: directory}])
    setIndexedFileClusters({...indexedFileClusters, [directory]: [...indexedFileClusters[directory] ?? [], id.toString()]});
  }

  return (
    // do not touch width and height of this div without verifying it does not break AutoZoom
    <div id={svgParentID} onClick={click}>
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
            <g className={svgClass} key={svgClass} />
          )
        }
      </svg>
    </div>
  );
}
