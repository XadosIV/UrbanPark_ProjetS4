import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from "@mui/material";

export function CreateSpotType() {

    const [spotTypes, setSpotTypes] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:3001/api/spottypes").then((res) => 
        setSpotTypes(res.data)
		)}, []);

  return (
    <Dropdown className="dropdown">
    <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropbtn">
        Types de places
    </Dropdown.Toggle>

    <Dropdown.Menu className="dropdown-content">
        {spotTypes.map((type) => (<Dropdown.Item href="#/action-1" style={{textAlign:"center"}}>{type.name}</Dropdown.Item>))}
        <Button variant="contained" color="primary" 
			style={{
				backgroundColor: "#FE434C",
				borderColor: "transparent",
				borderRadius: 20,
				width: 250,
				float:"right",
				height:"120%"
			}}>Nouveau type de place</Button>	
    </Dropdown.Menu>
  </Dropdown>
  );
  

}
