import React from "react";
import { Spot } from "../components"

export function SpotsList(props) {

    const filteredData = props.list.filter((el) => {
        //if no input the return the original
        if (props.inputFloor === "%" && props.inputNumber === 0) {
            return el;
        }
        //return the item which contains the user input
        else {
            if (props.inputNumber == 0) {
                return el.floor == props.inputFloor
            } else if (props.inputFloor == "%"){
                return el.number == props.inputNumber
            } else {
                return el.floor == props.inputFloor && el.number == props.inputNumber
            }
        }
    })

	return (<div className="all-spots">
            	{
                    filteredData.map((spot) => (
                        <Spot spot={spot}/>
                    ))
                }
		</div>)
}