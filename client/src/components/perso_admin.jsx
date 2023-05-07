import React, { useState } from "react";
import { Button } from "@mui/material";
import { ScheduleGuardian, ScheduleService, AdminPage, ListeDemandeAbo } from "../components";

export function PersoAdmin(){
    const [ affEdtGardien, setAffEdtGardien ] = useState(false);
    const [ affEdtEntretient, setAffEdtEntretien ] = useState(false);
    const [ affAdminPage, setAffAdminPage ] = useState(false);
    const [ affDemandeAbo, setAffDemandeAbo ] = useState(false)

    const toggleAffGardien = () => {
        setAffEdtEntretien(false);
        setAffAdminPage(false);
        setAffDemandeAbo(false)
        affEdtGardien ? setAffEdtGardien(false) : setAffEdtGardien(true);
    }
    const toggleAffEntretient = () => {
        setAffEdtGardien(false);
        setAffAdminPage(false);
        setAffDemandeAbo(false)
        affEdtEntretient ? setAffEdtEntretien(false) : setAffEdtEntretien(true);
    }
    const toggleAffAdminPage = () => {
        setAffEdtGardien(false);
        setAffEdtEntretien(false);
        setAffDemandeAbo(false)
        affAdminPage ? setAffAdminPage(false) : setAffAdminPage(true);
    }
    const toggleAffDemande = () => {
        setAffEdtGardien(false);
        setAffEdtEntretien(false);
        setAffAdminPage(false)
        affDemandeAbo ? setAffDemandeAbo(false) : setAffDemandeAbo(true);
    }

    return(<div className="div-perso">
        <div className="div-UI">
            <Button 
                className="UI-Button" 
                variant="contained" 
                color="primary" 
                onClick={ toggleAffGardien }
            > planning des gardiens </Button>
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
                onClick={ toggleAffAdminPage }
            > options Administrateur </Button>
            <Button 
                className="UI-Button" 
                variant="contained" 
                color="primary" 
                onClick={ toggleAffDemande }
            > demandes d'abonnement </Button>
        </div>
        { affEdtGardien && <ScheduleGuardian /> }
        { affEdtEntretient && <ScheduleService /> }
        { affAdminPage && <AdminPage /> }
        { affDemandeAbo && <ListeDemandeAbo /> }
    </div>)
}