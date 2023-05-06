import React from "react";
import { User } from "../components"


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
        <ul className="user-list">
            {filteredData.map((user, index) => (
                <User user={user} index={index}/>))}
		</ul>
    )
}