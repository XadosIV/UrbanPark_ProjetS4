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
            var res = false;
            if (el.name_type != null) { 
                res = el.name_type.toLowerCase() == props.inputType 
            }
            return res;
        }

        var tabRight = [[props.inputFloor === "%", el.floor == props.inputFloor], [props.inputNumber === "" || props.inputNumber === 0, el.number == props.inputNumber], [props.inputType === "%", TestTy()]]
        var res = true;

        for (let i=0; i<tabRight.length; i++) {
            if (!tabRight[i][0]) {
                res = res && tabRight[i][1]
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