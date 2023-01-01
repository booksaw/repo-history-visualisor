/**
 * Auto zoom functionality for the SVG so it scales to fit the entire SVG on the screen
 */
import * as d3 from 'd3';
import { svgClasses } from './components/NetworkDiagram';



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
            .scaleExtent([0.01, 8])
            .on("zoom", zoomed);
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