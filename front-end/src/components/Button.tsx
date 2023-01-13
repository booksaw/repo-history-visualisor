import { CSSProperties } from "react";
import './css/Input.css';

export interface ButtonProps {
    text: JSX.Element | string;
    type?: "button" | "submit" | "reset" | undefined; 
    className?: string;
    style?: CSSProperties | undefined;
}

export default function Button(props: ButtonProps) {

    let classes = "buttonClass intputStyle";
    if (props.className) {
        classes += " " + props.className;
    }

    return (
        <button style={props.style} type={props.type ? props.type : "button"} className={classes}>{props.text}</button>
    );
}