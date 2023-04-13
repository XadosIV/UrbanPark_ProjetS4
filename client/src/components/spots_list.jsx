import React, { useState, useEffect } from "react";
import { Spot } from "../components"

export function SpotsList(props) {

	return (<div className="all-spots">
            	{
                    props.list.map((spot) => (
                        <Spot spot={spot} size={Math.ceil(Math.sqrt(props.list.length))}/>
                    ))
                }
		</div>)
}
