import React, { useState } from "react";
import { EdtAgentEntratien, EdtGardien } from "../components";
import { Button } from "@mui/material";

export function PersoGardien(props){
    const { id } = props;
    const [ affEdtGardien, setAffEdtGardien ] = useState(false);
    const [ affEdtEntretient, setAffEdtEntretien ] = useState(false);

    const toggleAffGardien = () => {
        setAffEdtEntretien(false);
        affEdtGardien ? setAffEdtGardien(false) : setAffEdtGardien(true);
    }
    const toggleAffEntretient = () => {
        setAffEdtGardien(false);
        affEdtEntretient ? setAffEdtEntretien(false) : setAffEdtEntretien(true);
    }

    return(<div className="div-perso">
        <div className="div-UI">
            <Button 
                className="UI-Button" 
                variant="contained" 
                color="primary" 
                onClick={ toggleAffGardien }
            > mon planning </Button>
            <Button 
                className="UI-Button" 
                variant="contained" 
                color="primary" 
                onClick={ toggleAffEntretient }
            > planning des agents d'entretient </Button>
        </div>
        { affEdtGardien && <EdtGardien id={id} /> }
        { affEdtEntretient && <EdtAgentEntratien /> }
    </div>)
}