import React from "react";
import { Spot } from "../components"
import { GetSpotsFromFilter } from "../interface";

export function SpotsList(props) {
    
    function Callback(childData) {
        props.handleCallback(childData)
    }

    function toggleSpotArr(spotData){
        props.checkBoxCallback(spotData)
    }

    function isChecked(idSpot){
        return props.toCheck(idSpot);
    }

    const filteredData = GetSpotsFromFilter(props.list, props.infos)

    const generateKey = (index, spot) => {
        let id = ""+ index + spot.floor + spot.number;
        return id;
    }

	return (<div className="all-spots">
            	{
                    filteredData.map((spot, index) => (
                        <Spot spot={spot} key={generateKey(index, spot)} handleCallback={Callback} checkBoxCallback={toggleSpotArr} toCheck={isChecked} up={props.up}/>
                    ))
                }
		</div>)
}