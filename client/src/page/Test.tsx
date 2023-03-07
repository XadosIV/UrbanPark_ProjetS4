import React from "react";

import { ExampleName } from "../components";


export function Test() {
    return(<div>
        <h1>Test Page</h1>
        <p>Test page body </p>
        <ExampleName name="John" age={20} />
    </div>)
}