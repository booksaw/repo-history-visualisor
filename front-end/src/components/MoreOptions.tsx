import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

export interface MoreOptionsProps {
    debugMode?: boolean,
    setDebugMode: (mode: boolean) => void,
    manualMode?: boolean,
    setManualMode: (mode: boolean) => void,
    milestoneURL?: string, 
    setMilestoneURL: (url: string) => void,
}

export default function MoreOptions(props: MoreOptionsProps) {

    const [expanded, setExpanded] = useState<boolean>(false);

    const onExpand = () => {
        setExpanded(!expanded);
    }

    return (
        <div style={{ width: "100%", position: "absolute", top: "55%" }}>
            <div style={{ width: "70%", margin: "auto", display: "flex", flexDirection: "column" }}>
                <button style={{ color: "#9999FF", background: "none", border: "none" }} onClick={onExpand}>{(expanded) ? "Hide" : "Show"} Additional Options </button>
                <div style={{ display: (expanded) ? "flex" : "none", width: "100%", fontSize: 13 }}>
                    <div style={{padding: "20px"}}>
                        <input type={"checkbox"} onChange={() => { props.setManualMode(!props.manualMode); }} checked={props.manualMode ? true : false} />
                        <label id={"moreOptionsManual"}> Display Debug Information</label>
                        <Tooltip anchorId="moreOptionsManual" place="bottom" style={{ fontSize: 13 }} content="The visualisation only progresses manually when you click your mouse" />
                    </div>
                    <div style={{padding: "20px"}}>
                        <input type={"checkbox"} onChange={() => { props.setDebugMode(!props.debugMode); }} checked={props.debugMode ? true : false} />
                        <label id={"moreOptionsDebug"}> Enable Manual Progression</label>
                        <Tooltip anchorId="moreOptionsDebug" place="bottom" style={{ fontSize: 13 }} content="Displays Debug information about the visualisation" />
                    </div>
                    <div style={{padding: "20px"}}>
                        <label id={"moreOptionsMilestones"}> Milestones URL: </label>
                        <input type={"text"} onChange={(e) => { props.setMilestoneURL(e.target.value); }} value={props.milestoneURL ? props.milestoneURL : ""} placeholder={"Milestone URL..."}/>
                        
                        <Tooltip anchorId="moreOptionsMilestones" place="bottom" style={{ fontSize: 13 }} content="A file containing user defined milestone data" />
                    </div>
                </div>
            </div>
        </div>
    )

}