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
            if (el.types.length !== 0) { 
                for (let type of el.types) {
                    if (type === props.infos.type) {
                        return true
                    }
                }
            }
            return false
        }

        var tabRight = [[props.infos.firstFloor === "%", el.floor, props.infos.firstFloor], 
                        [props.infos.firstNumber === "" || props.infos.firstNumber === 0, el.number, props.infos.firstNumber]]
        var secondTabRight = [[props.infos.secondFloor === "%", el.floor, props.infos.secondFloor], 
                              [props.infos.secondNumber === "" || props.infos.secondNumber === 0, el.number, props.infos.secondNumber]]

        var res = true;
        //Test if type entered is the right one
        if (props.infos.type !== "%") {
            res = res && TestTy()
        }
        if (res) {
            //Test if there is a second value entered
            if (props.infos.secondFloor !== "%" || (props.infos.secondNumber !== "" && props.inputSecondNumber !== 0)) { 
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
                    filteredData.map((spot, index) => (
                        <Spot spot={spot} key={index} />
                    ))
                }
		</div>)
}