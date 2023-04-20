import React from "react";
import { EdtAgentEntratien } from "../components";

export function PersoAgenentEntretient(props){
    const { id } = props;

    return(<div className="div-perso">
        <EdtAgentEntratien id={id} />
    </div>)
}