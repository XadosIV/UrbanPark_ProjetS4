/**
 * SpotName
 * Return the name of the spot (Example : B145)
 * 
 * @param spot - The spot with all parameters
 * @returns { String }
 */

export function SpotName(spot) {
    return ""+spot.id_park+spot.floor+"-"+spot.number;
}
