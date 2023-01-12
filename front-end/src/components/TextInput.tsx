import { CSSProperties } from "react";

export interface TextInputProps {
    placeholder?: string;
    type?: "button" | "submit" | "reset" | undefined; 
    className?: string;
    style?: CSSProperties | undefined;
    onChange?: (text: string) => void; 
}

export default function TextInput (props: TextInputProps) {

    let classes = "textInputClass intputStyle";
    if (props.className) {
        classes += " " + props.className;
    }

    function handleChange(e: any) {
        if(props.onChange) {
            props.onChange(e.target.value);
        }
    }

    return (
        <input style={props.style} type={"text"} className={classes} placeholder={props.placeholder} onChange={handleChange}></input>
    );

}