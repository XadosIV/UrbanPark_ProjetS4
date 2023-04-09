/**
 * CutAdress
 * Return an array with : The location in the city / The postal code and the name of the city
 * 
 * @param address - The address to cut
 * @returns Array
 */

export function CutAddress(address) {
    var cityAddress = "";
    while (!(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(address[2]) && address[1]!= " ")) {
        cityAddress += address[0];
        address = address.substring(1);   
    }
    return [cityAddress, address];
}
