import React from "react";
import { Spot } from "../components"

export function SpotsList(props) {

    const filteredData = props.list.filter((el) => {
        var testNb = el.number == props.inputNumber;
        var testFl = el.floor == props.inputFloor;

        /**
         * TestTy
         * Returns a boolean if el.name_type is equal to the prop entered.
         *
         * @return { Boolean }
         */
        function TestTy() {
            var res = false;
            if (el.name_type != null) { 
                res = el.name_type.toLowerCase() == props.inputType 
            }
            return res;
        }
        //if no input the return the original
        if (props.inputFloor === "%" && (props.inputNumber === 0 || props.inputNumber === "") && props.inputType === "%") {
            return el;
        }
        //return the item which contains the user input
        else {
            if (props.inputNumber == 0) {
                if (props.inputFloor == "%") {
                    return TestTy()
                } else if (props.inputType == "%") {
                    return testFl
                } else {
                    return testFl && TestTy()
                }
            } else if (props.inputType == "%") {
                if (props.inputFloor == "%") {
                    return testNb
                } else {
                    return testFl && testNb
                }
            } else if (props.inputFloor == "%") {
                    return TestTy() && testNb
            } else {
                return testFl && testNb && TestTy()
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