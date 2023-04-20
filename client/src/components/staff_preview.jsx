import React, { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ViewAgenda } from "./"

export function StaffPreview(list) {
	const[agenda, SetAgenda] = useState(0);

    const filteredData = list.list.filter((el) => {
        //if no input the return the original
        if (list.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.first_name.toLowerCase().includes(list.input) || el.last_name.toLowerCase().includes(list.input) || (el.first_name.toLowerCase()+" "+el.last_name.toLowerCase()).includes(list.input)
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
        if (id === 1) {
            return "Travaille";
        } else {
            return "Inactif";
        }
    }

	return (
        <div>
			<ul className="staff-list">
            {filteredData.map((staff) => (
                <li>
                    <div style={{display:"flex", alignItems:"center", flexDirection:"row"}}>
						<div className="staff-infos">
							<div>
								<h3>{staff.first_name} {staff.last_name} - {staff.email}</h3>
								<p>{staff.role} - {Working(staff.id)}</p>
							</div>                       
						</div>
						
						<div className="button-schedule" style={{marginLeft:"30px"}}>
							<Button variant="contained" color="primary" onClick={()=>agenda == staff.id ? SetAgenda(0): SetAgenda(staff.id)}>Voir l'emploi du temps</Button>
						</div>
					</div>
					<div>
						{agenda == staff.id && <ViewAgenda props={{user:staff.id}}/>}
					</div>
                </li>))}
			</ul>
		</div>
    )
}
