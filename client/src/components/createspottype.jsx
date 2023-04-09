import React, { useState, useMemo } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from "@mui/material";

export function CreateSpotType() {

    const categories = ["all", "recette", "video", "article"];  
  
    const listType = [  
    {
        name:"Handicape"
    },  
    {
        name:"Municipal" 
    },  
    {
        name:"Electrique"  
    },  
    {
        name:"Urgence"
    },  
    {
        name:"Abonne" 
    },  
    ];  

  return (
    <Dropdown className="dropdown">
    <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropbtn">
        Types de places
    </Dropdown.Toggle>

    <Dropdown.Menu className="dropdown-content">
        {listType.map((type) => (<Dropdown.Item href="#/action-1" style={{textAlign:"center"}}>{type.name}</Dropdown.Item>))}
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
