import React, { useState } from "react";
import { AdminGuardian, ScheduleService, ScheduleGuardian } from ".";
import { Button } from "@mui/material";

export function PersoGuardian(props){
    const { id } = props;
    const [ affEdtGardien, setAffEdtGardien ] = useState(false);
    const [ affEdtEntretient, setAffEdtEntretien ] = useState(false);
    const [ affAdminGardien, setAffAdminGardien ] = useState(false);

    const toggleAffGardien = () => {
        setAffEdtEntretien(false);
        setAffAdminGardien(false);
        affEdtGardien ? setAffEdtGardien(false) : setAffEdtGardien(true);
    }
    const toggleAffEntretient = () => {
        setAffEdtGardien(false);
        setAffAdminGardien(false);
        affEdtEntretient ? setAffEdtEntretien(false) : setAffEdtEntretien(true);
    }
    const toggleAffAdminGardien = () => {
        setAffEdtGardien(false);
        setAffEdtEntretien(false);
        affAdminGardien ? setAffAdminGardien(false) : setAffAdminGardien(true);
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
            > planning des agents d'entretien </Button>
            <Button 
                className="UI-Button" 
                variant="contained" 
                color="primary" 
                onClick={ toggleAffAdminGardien }
            > options d'administration </Button>
        </div>
        { affEdtGardien && <ScheduleGuardian id={id} /> }
        { affEdtEntretient && <ScheduleService /> }
        { affAdminGardien  && <AdminGuardian /> }
    </div>)
}