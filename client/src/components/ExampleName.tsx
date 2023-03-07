import React from "react";

//interface props for the component
interface Props {
    name: string;
    age: number;
}


export function ExampleName(props: Props) {
    return(<div>
        <h1>Component Example</h1>
        <p>Component Example body </p>
        <p>name: {props.name}</p>
        <p>age: {props.age}</p>

    </div>)
}