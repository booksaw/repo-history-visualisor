/**
 * Auto zoom functionality for the SVG so it scales to fit the entire SVG on the screen
 */
import * as d3 from 'd3';
import { svgClasses, svgParentID } from './components/NetworkDiagram';



export class AutoZoom {

    svg: any;
    private zoomInstance: d3.ZoomBehavior<Element, unknown>;

    constructor(svg: any) {
        this.svg = svg;

        // function called to perform the transformation when a zoom / pan occurs
        const zoomed = (e: any) => {
            svgClasses.forEach(svgClass => {
                this.svg.select("." + svgClass).attr("transform", e.transform);
            });
        }

        // the d3-zoom instance that handles the zooming and panning 
        this.zoomInstance = d3.zoom()
            .on("zoom", zoomed);
    }

    zoomFit() {
        const bounds = this.svg.node().getBBox();
        // console.log(bounds);
        const parent = d3.select("#" + svgParentID);
        let fullWidth = parseInt(parent.style("width").replace("px", ""));
        let fullHeight = parseInt(parent.style("height").replace("px", ""));
        var width = bounds.width,
            height = bounds.height;
        // the bounds are empty
        if (width === 0 || height === 0) {
            return;
        }
        // console.log("height", height); 
        // console.log("fullHeight", fullHeight)
        var scale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
        console.log(scale);
        const transform = d3.zoomIdentity
            .scale(scale);
        this.svg
            .transition()
            .duration(50)
            .call(this.zoomInstance.transform, transform);
    }

    /**
     * Used to register manual controls for zooming and panning
     * the user can then scroll with the mouse wheel
     * the user can click and drag to pan the camera
     */
    registerManualZoomControls() {
        this.svg.call(this.zoomInstance);
    }

}