import React from "react";
import { ViewAgenda } from "./view_agenda";

export function EdtGardien(props){
    const { id } = props;

    return(<div className="div-edt-gardien">
        <h2>Emploi du temps Gardien</h2>
        <ViewAgenda props={{user: id}} />
    </div>)
}