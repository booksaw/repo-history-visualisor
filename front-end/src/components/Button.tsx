import { CSSProperties } from "react";
import './css/Input.css';

export interface ButtonProps {
    text: JSX.Element | string;
    type?: "button" | "submit" | "reset" | undefined; 
    className?: string;
    style?: CSSProperties | undefined;
}

/**
 * Button used within the clone form to avoid repeted code
 * @param props The properties to use for the button
 * @returns The created button 
 */
export default function Button(props: ButtonProps) {

    let classes = "buttonClass intputStyle";
    if (props.className) {
        classes += " " + props.className;
    }

    return (
        <button style={props.style} type={props.type ? props.type : "button"} className={classes}>{props.text}</button>
    );
}