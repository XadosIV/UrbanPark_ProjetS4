import React from "react";
import { Spot } from "../components"

export function SpotsList(props) {

    const filteredData = props.list.filter((el) => {
        //if no input the return the original
        if (props.inputFloor === "%" && (props.inputNumber === 0 || props.inputNumber === "") && props.inputType === "%") {
            return el;
        }
        //return the item which contains the user input
        else {
            if (props.inputNumber == 0) {
                if (props.inputFloor == "%") {
                    if (el.name_type != null) {
                        return el.name_type.toLowerCase() == props.inputType
                    }
                } else if (props.inputType == "%") {
                    return el.floor == props.inputFloor
                } else {
                    if (el.name_type != null) {
                        return el.floor == props.inputFloor && el.name_type.toLowerCase() == props.inputType
                    }
                }
            } else if (props.inputType == "%") {
                if (props.inputFloor == "%") {
                    return el.number == props.inputNumber
                } else {
                    return el.floor == props.inputFloor && el.number == props.inputNumber
                }
            } else if (props.inputFloor == "%") {
                if (el.name_type != null) {
                    return el.name_type.toLowerCase() == props.inputType && el.number == props.inputNumber
                }
            } else {
                if (el.name_type != null) {
                    return el.floor == props.inputFloor && el.number == props.inputNumber && el.name_type.toLowerCase() == props.inputType
                }
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