import React, { useState, useEffect } from "react";
import TAS from "../services/take_all_spots"
import { Spot } from "../components"

export function SpotsList(props) {
	
    const [spotsList, setSpotsList] = useState([]);

    useEffect(() => {
		TAS.TakeAllSpots(props.id).then(res => setSpotsList(res))
	}, []);

	return (<div className="all-spots">
            	{
                    spotsList.map((spot) => (
                        <Spot spot={spot} size={Math.ceil(Math.sqrt(spotsList.length))}/>
                    ))
                }
		</div>)
}
