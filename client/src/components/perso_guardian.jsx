import React, { useState } from "react";
import { AdminGuardian, ScheduleService, ScheduleGuardian, ListeDemandeAbo } from ".";
import { Button } from "@mui/material";

export function PersoGuardian(props){
    const { id } = props;
    const [ affEdtGardien, setAffEdtGardien ] = useState(false);
    const [ affEdtEntretient, setAffEdtEntretien ] = useState(false);
    const [ affAdminGardien, setAffAdminGardien ] = useState(false);
    const [ affDemandeAbo, setAffDemandeAbo ] = useState(false)

    const toggleAffGardien = () => {
        setAffEdtEntretien(false);
        setAffAdminGardien(false);
        setAffDemandeAbo(false)
        affEdtGardien ? setAffEdtGardien(false) : setAffEdtGardien(true);
    }
    const toggleAffEntretient = () => {
        setAffEdtGardien(false);
        setAffAdminGardien(false);
        setAffDemandeAbo(false)
        affEdtEntretient ? setAffEdtEntretien(false) : setAffEdtEntretien(true);
    }
    const toggleAffAdminGardien = () => {
        setAffEdtGardien(false);
        setAffEdtEntretien(false);
        setAffDemandeAbo(false)
        affAdminGardien ? setAffAdminGardien(false) : setAffAdminGardien(true);
    }
    const toggleAffDemande = () => {
        setAffEdtGardien(false);
        setAffEdtEntretien(false);
        setAffAdminGardien(false)
        affDemandeAbo ? setAffDemandeAbo(false) : setAffDemandeAbo(true);
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
            <Button 
                className="UI-Button" 
                variant="contained" 
                color="primary" 
                onClick={ toggleAffDemande }
            > demandes d'abonnement </Button>
        </div>
        { affEdtGardien && <ScheduleGuardian id={id} /> }
        { affEdtEntretient && <ScheduleService /> }
        { affAdminGardien  && <AdminGuardian /> }
        { affDemandeAbo && <ListeDemandeAbo /> }
    </div>)
}