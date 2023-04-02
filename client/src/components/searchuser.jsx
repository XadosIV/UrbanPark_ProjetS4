import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export function SearchUser(list) {

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

	return (
        <ul className="staff-list">
            {filteredData.map((user) => (
                <li>
                    <div className="staff-infos">
                        <div>
                            <h3>{user.first_name} {user.last_name} - {user.email}</h3>
                            <p>{user.role} - <Link to={`/${user.id}/spot`} style={{textDecoration:"none"}}>Place n°{user.spot}</Link> </p>
                        </div>                       
                    </div>
                    <div className="button-schedule">
                        <Link to={`/${user.id}/profile`} style={{textDecoration:"none"}}>
                            <Button variant="contained" color="primary">Voir les informations de l'utilisateur</Button>
                        </Link>
                    </div>
                </li>))}
		</ul>
    )
}
