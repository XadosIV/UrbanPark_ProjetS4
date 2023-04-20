import React from "react";
import { EdtAgentEntratien } from "../components";
import { useState } from "react";
import { Button } from "@mui/material";

export function PersoAgenentEntretient(props){
    const { id } = props;
    const [ affEdtEntretient, setAffEdtEntretien ] = useState(false);

    const toggleAffEntretient = () => {
        affEdtEntretient ? setAffEdtEntretien(false) : setAffEdtEntretien(true);
    }

    return(<div className="div-perso">
        <div className="div-UI">
        <Button 
            className="UI-Button" 
            variant="contained" 
            color="primary" 
            onClick={ toggleAffEntretient }
        > mon planning </Button>
        </div>
        { affEdtEntretient && <EdtAgentEntratien id={id} /> }
    </div>)
}