import React from "react";
import { Spot } from "../components"

export function SpotsList(props) {

    const filteredData = props.list.filter((el) => {
        /**
         * TestTy
         * Returns a boolean if el.name_type is equal to the prop entered.
         *
         * @return { Boolean }
         */
        function TestTy() {
            if (el.types.length != 0) { 
                for (let type of el.types) {
                    if (type.toLowerCase() == props.inputType) {
                        return true
                    }
                }
            }
            return false
        }

        var tabRight = [[props.inputFloor === "%", el.floor, props.inputFloor], 
                        [props.inputNumber === "" || props.inputNumber === 0, el.number, props.inputNumber]]
        var secondTabRight = [[props.inputSecondFloor === "%", el.floor, props.inputSecondFloor], 
                              [props.inputSecondNumber === "" || props.inputSecondNumber === 0, el.number, props.inputSecondNumber]]

        var multiple = 10000
        var value = el.floor*multiple + el.number
        var res = true;
        //Test if type entered is the right one
        if (props.inputType !== "%") {
            res = res && TestTy()
        }
        if (res) {
            //Test if there is 2 second values entered
            if (props.inputSecondFloor !== "%" && (props.inputSecondNumber !== "" && props.inputSecondNumber !== 0)) {
                res = res && (value >= parseInt(props.inputFloor)*multiple + parseInt(props.inputNumber)) && (value <= parseInt(props.inputSecondFloor)*multiple + parseInt(props.inputSecondNumber))
            } else if (props.inputSecondFloor !== "%" || (props.inputSecondNumber !== "" && props.inputSecondNumber !== 0)) { //Test if there is a single second value entered
                for (let i=0; i<secondTabRight.length; i++) {
                    //If there is, check if element is between first and second value
                    if (!secondTabRight[i][0]) { 
                        res = res && tabRight[i][1] >= tabRight[i][2] && secondTabRight[i][1] <= secondTabRight[i][2] 
                    } else { //If there is no second value, check the first one to see if it's equal
                        if (!tabRight[i][0]) {
                            res = res && tabRight[i][1] == tabRight[i][2]
                        }
                    }
                }
            //If there is no second value entered
            } else {
                //Check every value entered
                for (let j=0; j<tabRight.length; j++) {
                    if (!tabRight[j][0]) {
                        res = res && tabRight[j][1] == tabRight[j][2]
                    }
                }
            }
        }
        return res
    })

	return (<div className="all-spots">
            	{
                    filteredData.map((spot) => (
                        <Spot spot={spot}/>
                    ))
                }
		</div>)
}