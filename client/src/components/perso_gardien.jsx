import React from "react";
import { EdtGardien } from "../components";

export function PersoGardien(props){
    const { id } = props;

    return(<div className="div-perso">
        <EdtGardien id={id} />
    </div>)
}