export function cutAddress(address) {
    var cityAddress = "";
    while (!(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(address[2]) && address[1]!= " ")) {
        cityAddress += address[0];
        address = address.substring(1);   
    }
    return [cityAddress, address];
}