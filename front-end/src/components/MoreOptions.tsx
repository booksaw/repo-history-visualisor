import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

export interface MoreOptionsProps {
    debugMode?: boolean,
    setDebugMode: (mode: boolean) => void,
    manualMode?: boolean,
    setManualMode: (mode: boolean) => void,
    settingsURL?: string,
    setSettingsURL: (url: string) => void,
    hideKey?: boolean, 
    setHideKey: (hideKey: boolean) => void,
}

export default function MoreOptions(props: MoreOptionsProps) {

    const [expanded, setExpanded] = useState<boolean>(false);

    const onExpand = () => {
        setExpanded(!expanded);
    }

    return (
        <div style={{ width: "100%", position: "absolute", top: "55%" }}>
            <div style={{ width: "70%", margin: "auto", display: "flex", flexDirection: "column" }}>
                <button id="moreExpandButton" style={{ color: "#9999FF", background: "none", border: "none" }} onClick={onExpand}>{(expanded) ? "Hide" : "Show"} Additional Options </button>

                {/* Options in its expanded state */}
                <div id="moreExpandControlDiv" style={{ display: (expanded) ? "flex" : "none", width: "100%", fontSize: 13 }}>

                    {/* Debug toggle */}
                    <MoreOptionsOption>
                        <input id={"moreDebugInput"} type={"checkbox"} onChange={() => { props.setDebugMode(!props.debugMode); }} checked={props.debugMode ? true : false} />
                        <label id={"moreOptionsDebug"}> Display Debug Information</label>
                        <Tooltip anchorId="moreOptionsDebug" place="bottom" style={{ fontSize: 13 }} content="Displays Debug information about the visualisation" />
                    </MoreOptionsOption>

                    {/* Manual toggle */}
                    <MoreOptionsOption>
                        <input id={"moreManualInput"} type={"checkbox"} onChange={() => { props.setManualMode(!props.manualMode); }} checked={props.manualMode ? true : false} />
                        <label id={"moreOptionsManual"}> Enable Manual Progression</label>
                        <Tooltip anchorId="moreOptionsManual" place="bottom" style={{ fontSize: 13 }} content="The visualisation only progresses manually when you click your mouse" />
                    </MoreOptionsOption>

                    {/* Hide key option */}
                    <MoreOptionsOption>
                        <input id={"moreKeyInput"} type={"checkbox"} onChange={() => { props.setHideKey(!props.hideKey); }} checked={props.hideKey ? true : false} />
                        <label id={"moreOptionsKey"}> Hide File Type Key</label>
                        <Tooltip anchorId="moreOptionsKey" place="bottom" style={{ fontSize: 13 }} content="Enable to hide the key which displays the extensions of all files" />
                    </MoreOptionsOption>

                    {/* settings URL input */}
                    <MoreOptionsOption>
                        <label id={"moreOptionsSettings"}> Settings URL: </label>
                        <input id={"moreSettingsInput"} type={"text"} onChange={(e) => { props.setSettingsURL(e.target.value); }} value={props.settingsURL ? props.settingsURL : ""} placeholder={"Settings URL..."} />
                        <Tooltip anchorId="moreOptionsSettings" place="bottom" style={{ fontSize: 13 }} content="A file containing user defined visualisation settings" />
                    </MoreOptionsOption>
                </div>
            </div>
        </div>
    )

}

interface MoreOptionsOptionProps {
    children: JSX.Element[]
}

function MoreOptionsOption(props?: MoreOptionsOptionProps) {
    return (
        <div style={{ padding: "20px" }}>
            {props?.children}
        </div>
    )
}