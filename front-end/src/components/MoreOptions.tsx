import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { SpeedOptions, VisualisationSpeedOptions } from "../visualisation/VisualisationSpeedOptions";

export interface MoreOptionsProps {
    debugMode?: boolean,
    setDebugMode: (mode: boolean) => void,
    speed: VisualisationSpeedOptions,
    setSpeed: (mode: VisualisationSpeedOptions) => void,
    settingsURL?: string,
    setSettingsURL: (url: string) => void,
    fileKey?: boolean,
    setKey: (hideKey: boolean) => void,
    displayFileNames?: boolean,
    setDisplayFileNames: (displayFileNames?: boolean) => void,
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
                <div id="moreExpandControlDiv" style={{ width: "70%", fontSize: 13, display: (expanded) ? "block" : "none", margin: "auto" }}>
                    <div style={{ display: "flex" }}>
                        {/* Debug toggle */}
                        <MoreOptionsOption>
                            <input id={"moreDebugInput"} type={"checkbox"} onChange={() => { props.setDebugMode(!props.debugMode); }} checked={props.debugMode ? true : false} />
                            <label id={"moreOptionsDebug"}> Display Debug Information</label>
                            <Tooltip anchorId="moreOptionsDebug" place="bottom" style={{ fontSize: 15 }} content="Displays Debug information about the visualisation" />
                        </MoreOptionsOption>

                        {/* speed dropdown */}
                        <MoreOptionsOption>
                            <label id={"moreOptionsManual"}>Select Visualisation Speed </label>
                            <select id={"moreSpeedInput"} onChange={(event) => { props.setSpeed(SpeedOptions.getSpeedFromString(event.target.value)); }} value={SpeedOptions.getStringFromVisSpeed(props.speed)}>
                                <option value="MANUAL">MANUAL</option>
                                <option value="SLOW">SLOW</option>
                                <option value="NORMAL">NORMAL</option>
                                <option value="FAST">FAST</option>
                                <option value="VERYFAST">VERY FAST</option>
                            </select>
                            <Tooltip anchorId="moreOptionsManual" place="bottom" style={{ fontSize: 13 }} content="The visualisation only progresses manually when you click your mouse" />
                        </MoreOptionsOption>

                        {/* Hide key option */}
                        <MoreOptionsOption>
                            <input id={"moreKeyInput"} type={"checkbox"} onChange={() => { props.setKey((props.fileKey === false)); }} checked={props.fileKey === false ? false : true} />
                            <label id={"moreOptionsKey"}> Show File Type Key</label>
                            <Tooltip anchorId="moreOptionsKey" place="bottom" style={{ fontSize: 13 }} content="Enable to show the key which displays the extensions of all files" />
                        </MoreOptionsOption>

                        {/* display file names toggle */}
                        <MoreOptionsOption>
                            <input id={"moreFilesInput"} type={"checkbox"} onChange={() => { props.setDisplayFileNames(!props.displayFileNames); }} checked={(props.displayFileNames === false) ? false : true} />
                            <label id={"moreFilesDebug"}> Display file names Information</label>
                            <Tooltip anchorId="moreFilesDebug" place="bottom" style={{ fontSize: 13 }} content="Displays the file names of modified files" />
                        </MoreOptionsOption>
                    </div>
                    {/* settings URL input */}
                    <MoreOptionsOption>
                        <label id={"moreOptionsSettings"}> Settings URL: </label>
                        <input id={"moreSettingsInput"} type={"text"} onChange={(e) => { props.setSettingsURL(e.target.value); }} value={props.settingsURL ? props.settingsURL : ""} placeholder={"Settings URL..."} style={{ width: "500px" }} className="textInputClass intputStyleSmall"/>
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