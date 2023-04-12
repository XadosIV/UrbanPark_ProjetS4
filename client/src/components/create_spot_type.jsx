import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import TAST from "../services/take_all_spot_types"

export function CreateSpotType() {
    const [spotTypes, setSpotTypes] = useState([]);

    useEffect(() => {
        TAST.TakeAllSpotTypes().then(res => {setSpotTypes(res);});
    }, []);

  return (<div class="dropdown">
            <button class="dropbtn">Types de places</button>
                <div class="dropdown-content">
                {spotTypes.map((type) => (<p style={{textAlign:"center"}}>{type.name}</p>))}
                      <Button variant="contained" color="primary" 
                      style={{
                      backgroundColor: "#FE434C",
                      borderColor: "transparent",
                      borderRadius: 20,
                      width: 250,
                      float:"right",
                      height:"120%"
                    }}>Nouveau type de place</Button>	
                </div>
          </div>);


              

  
  

}
