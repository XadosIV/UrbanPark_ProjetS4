/**
 * GetSpotsFromFilter
 * Returns a list of spots corresponding to infos
 *
 * @param { Array } list - The entire list of spots
 * @param { Array } infos - The array of infos to filter
 * @return { Boolean }
 */
export function GetSpotsFromFilter(list, infos) {
    return list.filter((el) => {
        /**
         * TestTy
         * Returns a boolean if el.name_type is equal to the prop entered.
         *
         * @return { Boolean }
         */
        function TestTy() {
            if (el.types.length !== 0) { 
                for (let type of el.types) {
                    if (type === infos.type) {
                        return true
                    }
                }
            }
            return false
        }

        var tabRight = [[infos.firstFloor === "%", el.floor, infos.firstFloor], 
                        [infos.firstNumber === "", el.number, infos.firstNumber]]
        var secondTabRight = [[infos.secondFloor === "%", el.floor, infos.secondFloor], 
                              [infos.secondNumber === "", el.number, infos.secondNumber]]

        var res = true;
        //Test if type entered is the right one
        if (infos.type !== "%") {
            res = res && TestTy()
        }
        if (res) {
            //Test if there is a second value entered
            if (infos.secondFloor !== "%" || (infos.secondNumber !== "" && infos.secondNumber !== 0)) { 
                for (let i=0; i<secondTabRight.length; i++) {
                    //If there is, check if element is between first and second value
                    if (!secondTabRight[i][0]) { 
                        res = res && tabRight[i][1] >= tabRight[i][2] && secondTabRight[i][1] <= secondTabRight[i][2] 
                    } else { //If there is no second value, check the first one to see if it's equal
                        if (!tabRight[i][0]) {
                            res = res && tabRight[i][1] === tabRight[i][2]
                        }
                    }
                }
            //If there is no second value entered
            } else {
                //Check every value entered
                for (let j=0; j<tabRight.length; j++) {
                    if (!tabRight[j][0]) {
                        res = res && tabRight[j][1] === tabRight[j][2]
                    }
                }
            }
        }
        return res
    })
}
