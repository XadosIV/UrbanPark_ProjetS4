import React from "react";
import { SpotName } from "../interface"
import { Button } from "@mui/material";

export function SpotInfos({ spotInfos }) {

    const listeTypes = (arrTypes) => {
        let filteredArrTypes = arrTypes.filter(type => (type !== "Abonné"));
        if(filteredArrTypes.length < 1){
            return <li>Cette place n'a aucun type</li>
        }else{
            return arrTypes.map((type, index) => {
                if (type !== "Abonné") {
                    return <li key={index}>Place { type.toLowerCase() }</li>
                }else{
                    return null;
                }
            })
        }
    }

	return (
        <div className="dp">
            <Button variant="contained" color="primary" className="dropbtn" style={{width:"200px"}}>
                Place {SpotName(spotInfos)}
            </Button>
            <div className="dp-content">
                <ul className="ul-types-place">
                    { listeTypes(spotInfos.types) }
                </ul>
            </div>
        </div>
    )
}
