import React from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

export function StaffPreview(staff) {
    /**
     * Working
     * Returns if the user who corresponds to the id is currently working or not 
     * If he is working, returns where he is working, else returns "Inactif"
     * 
     * @param id - The id of the user you want to test
     * @returns String
     */

    function Working(id) {
        //FUNCTION TO DO LATER WHEN WE CAN GET INFORMATIONS FROM DATABASE
        if (id == 1) {
            return "Travaille";
        } else {
            return "Inactif";
        }
    }

	return (
        <div className="staff-list">	
            <div className="staff-infos">
                <div>
                    <h3>{staff.staff.firstName} {staff.staff.lastName} - {staff.staff.email}</h3>
                    <p>{staff.staff.role} - {Working(staff.staff.id)}</p>
                </div>
                
            </div>
            
            <div className="button-schedule">
                <Link to={`/${staff.staff.id}/schedule`}>
                    <Button variant="contained" color="primary" text-decoration="underline">Voir l'emploi du temps</Button>
                </Link>
            </div>
        </div>)
}
