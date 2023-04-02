import React from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

export function StaffPreview(list, input) {

    const filteredData = list.list.filter((el) => {
        //if no input the return the original
        if (list.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.firstName.toLowerCase().includes(list.input) || el.lastName.toLowerCase().includes(list.input)
        }
    })

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
        <ul id="staff-list">
            {filteredData.map((staff) => (
                <li>
                    <div className="staff-list">	
                        <div className="staff-infos">
                            <div>
                                <h3>{staff.firstName} {staff.lastName} - {staff.email}</h3>
                                <p>{staff.role} - {Working(staff.id)}</p>
                            </div>                       
                        </div>
                        
                        <div className="button-schedule">
                            <Link to={`/${staff.id}/schedule`} style={{textDecoration:"none"}}>
                                <Button variant="contained" color="primary">Voir l'emploi du temps</Button>
                            </Link>
                        </div>
                    </div>
                </li>))}
		</ul>
    )
}
