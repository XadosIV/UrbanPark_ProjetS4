import React from "react";
import { ViewAgenda } from "./view_agenda";

export function EdtGardien(props){
    const { id } = props;
    const input = id ? {user: id} : {role: "Gardien"};

    return(<div className="div-edt">
        <ViewAgenda props={input} />
    </div>)
}