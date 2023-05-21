/**
 * FindToggles
 * Return an array with all the modifications between 2 arrays (Things to toggle)
 * 
 * @param baseList - The first array
 * @param newList - The second array
 * @returns Array
 */
export function FindToggles(baseList, newList) {
    let changes = [];
    for (let base of baseList) {
        let found = false;
        for (let newU of newList) {	
            if (base === newU) {
                found = true;
            }
        }
        if (!found && newList.length !== 0){
            changes.push(base);
        }
    }
    for (let newU of newList) {
        let found = false;
        for (let base of baseList) {
            if (base === newU) {
                found = true;
            }
        }
        if (!found && baseList.length !== 0) {
            changes.push(newU)
        }
    }
    return changes;
}