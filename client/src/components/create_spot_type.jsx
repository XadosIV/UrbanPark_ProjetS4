import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import TAST from "../services/take_all_spot_types"

export function CreateSpotType() {
    const [spotTypes, setSpotTypes] = useState([]);

    useEffect(() => {
        TAST.TakeAllSpotTypes().then(res => {setSpotTypes(res);});
    }, []);

  return (<div className="dropdown">
            <Button className="dropbtn" style={{width: 200, height:"120%"}}>Types de places</Button>
                <div className="dropdown-content">
                {spotTypes.map((type, index) => (<p key={index} style={{textAlign:"center"}}>{type.name}</p>))}
                      <Button variant="contained" color="primary"
                      style={{
                      backgroundColor: "#FE434C",
                      borderColor: "transparent",
                      borderRadius: 20,
                      width: 200,
                      float:"right",
                      height:"120%"
                    }}>Nouveau type de place</Button>	
                </div>
          </div>);


              

  
  

}
