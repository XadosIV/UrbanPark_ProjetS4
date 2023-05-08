import { SpotName } from "../interface"

/**
 * AllSpots
 * Returns a lists of options for a Select React component composed of every type 
 *
 * @param { Array } list - List of spots in the parking
 * @return { Array }
 */
export function AllSpots(list) {
    var opt = []
    for (let i=0; i<list.length; i++) {
        opt.push({value:list[i].id, label:"Place " + SpotName(list[i])})
    }
    return opt
}