import React from "react";
import { ViewAgenda } from "./view_agenda";

export function ScheduleService(props){
    const { id } = props;
    const input = id ? {user: id} : {role: "Agent d'entretien"};

    return(<div className="div-edt">
        <ViewAgenda props={input} admin={props.admin}/>
    </div>)
}