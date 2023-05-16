import React, { useState } from "react";
import { Button } from "@mui/material";
import { ScheduleGuardian, ScheduleService, AdminPage, ListeDemandeAbo } from "../components";

export function PersoAdmin(props){
    const { id } = props;

    const [ affEdtGardien, setAffEdtGardien ] = useState(false);
    const [ affEdtEntretient, setAffEdtEntretien ] = useState(false);
    const [ affAdminPage, setAffAdminPage ] = useState(false);
    const [ affDemandeAbo, setAffDemandeAbo ] = useState(false)
    const [ affMyEdt, setAffMyEdt ] = useState(false)

    const toggleAffGardien = () => {
        setAffEdtEntretien(false);
        setAffAdminPage(false);
        setAffDemandeAbo(false)
        setAffMyEdt(false)
        affEdtGardien ? setAffEdtGardien(false) : setAffEdtGardien(true);
    }
    const toggleAffEntretient = () => {
        setAffEdtGardien(false);
        setAffAdminPage(false);
        setAffDemandeAbo(false)
        setAffMyEdt(false)
        affEdtEntretient ? setAffEdtEntretien(false) : setAffEdtEntretien(true);
    }
    const toggleAffAdminPage = () => {
        setAffEdtGardien(false);
        setAffEdtEntretien(false);
        setAffDemandeAbo(false)
        setAffMyEdt(false)
        affAdminPage ? setAffAdminPage(false) : setAffAdminPage(true);
    }

    const toggleAffDemande = () => {
        setAffEdtGardien(false);
        setAffEdtEntretien(false);
        setAffAdminPage(false)
        setAffMyEdt(false)
        affDemandeAbo ? setAffDemandeAbo(false) : setAffDemandeAbo(true);
    }

    const toggleAffMyEdt = () => {
        setAffEdtGardien(false)
        setAffEdtEntretien(false);
        setAffAdminPage(false);
        setAffDemandeAbo(false)
        affMyEdt ? setAffMyEdt(false) : setAffMyEdt(true);
    }

    return(<div className="div-perso">
        <div className="div-UI">
            <Button 
                className="UI-Button" 
                variant="contained" 
                color="primary" 
                onClick={ toggleAffMyEdt }
            > Mon planning </Button>
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
        { affMyEdt && <ScheduleGuardian id={id} admin={true}/> }
        { affEdtGardien && <ScheduleGuardian admin={true}/> }
        { affEdtEntretient && <ScheduleService admin={true}/> }
        { affAdminPage && <AdminPage /> }
        { affDemandeAbo && <ListeDemandeAbo /> }
    </div>)
}