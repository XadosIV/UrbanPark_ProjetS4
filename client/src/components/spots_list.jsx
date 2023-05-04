import React from "react";
import { Spot } from "../components"
import { GetSpotsFromFilter } from "../interface";

export function SpotsList(props) {
    
    function Callback(childData) {
        props.handleCallback(childData)
    }

    const filteredData = GetSpotsFromFilter(props.list, props.infos)

	return (<div className="all-spots">
            	{
                    filteredData.map((spot, index) => (
                        <Spot spot={spot} key={index} handleCallback={Callback} />
                    ))
                }
		</div>)
}