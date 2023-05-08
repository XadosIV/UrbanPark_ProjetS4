/**
     * BaseSpot
     * Returns a array corresponding to the base spot being passed in a react select defaultValue
     *
     * @param { integer } spot - id of the spot
     * @param { Array } list - List of options being passed in a react select
     * @return { Array }
     */
export function BaseSpot(spot, list) {
    var opts=[]
    for (let s of list) {
        if (s.value === spot) {
            opts.push(s);
        }
    }
    if (opts.length != 0) {
        return opts[0].label
    } else {
        return ""
    }
}