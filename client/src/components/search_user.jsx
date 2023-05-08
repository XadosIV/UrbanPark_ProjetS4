import React, { useEffect } from "react";
import { User } from "../components"
import { useState } from "react";
import { TakeAllSpots } from "../services";


export function SearchUser(props) {

    function Callback(childData) {
        props.handleCallback(childData)
    }

    const filteredData = props.list.filter((el) => {
        //if no input the return the original
        if (props.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.first_name.toLowerCase().includes(props.input) || el.last_name.toLowerCase().includes(props.input) || (el.first_name.toLowerCase()+" "+el.last_name.toLowerCase()).includes(props.input)
        }
    })

    const [ allSpots, setAllSpots ] = useState([]);
    useEffect(() => {
		TakeAllSpots().then(res => {
			console.log("blip", res);
			setAllSpots(res);
		})
	}, [])

	return (
        <ul className="user-list">
            {filteredData.map((user, index) => (
                <User user={user} index={index} handleCallback={Callback}  allSpots={allSpots}/>))}
		</ul>
    )
}