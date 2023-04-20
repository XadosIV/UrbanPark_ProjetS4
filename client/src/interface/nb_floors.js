/**
     * NbFloors
     * Returns a lists of options for a Select React component composed of every floor 
     *
     * @param { integer } nb - Number of floors in the parking
     * @param { Associative array } base - Base with "All floors" if needed
     * @return { Array }
     */
export function NbFloors(nb, base) {
    var opt = [];
    if (base) {
        opt.push(base)
    }
    for (let i=0; i<nb; i++) {
        opt.push({value:i.toString(), label:"Étage " + i.toString()})
    }
    return opt
}