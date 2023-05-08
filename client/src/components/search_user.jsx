import React from "react";
import { User } from "../components"


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

	return (
        <ul className="user-list">
            {filteredData.map((user, index) => (
                <User user={user} key={index} handleCallback={Callback}/>))}
		</ul>
    )
}