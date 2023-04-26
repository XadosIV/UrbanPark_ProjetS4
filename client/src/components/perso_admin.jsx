import React, { useState } from "react";
import { Button } from "@mui/material";
import { ScheduleGuardian, ScheduleService, AdminPage } from "../components";

export function PersoAdmin(){
    const [ affEdtGardien, setAffEdtGardien ] = useState(false);
    const [ affEdtEntretient, setAffEdtEntretien ] = useState(false);
    const [ affAdminPage, setAffAdminPage ] = useState(false);

    const toggleAffGardien = () => {
        setAffEdtEntretien(false);
        setAffAdminPage(false);
        affEdtGardien ? setAffEdtGardien(false) : setAffEdtGardien(true);
    }
    const toggleAffEntretient = () => {
        setAffEdtGardien(false);
        setAffAdminPage(false);
        affEdtEntretient ? setAffEdtEntretien(false) : setAffEdtEntretien(true);
    }
    const toggleAffAdminPage = () => {
        setAffEdtGardien(false);
        setAffEdtEntretien(false);
        affAdminPage ? setAffAdminPage(false) : setAffAdminPage(true);
    }

    return(<div className="div-perso">
        <div className="div-UI">
            <Button 
                className="UI-Button" 
                variant="contained" 
                color="primary" 
                onClick={ toggleAffGardien }
            > planning des gardien </Button>
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
        </div>
        { affEdtGardien && <ScheduleGuardian /> }
        { affEdtEntretient && <ScheduleService /> }
        { affAdminPage && <AdminPage /> }
    </div>)
}