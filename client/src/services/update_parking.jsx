import axios from "axios"

async function ServiceUpdateParking(parkingData, id){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/parkings/" + id;
    console.log(id, JSON.stringify(parkingData));
    return axios.put(url, parkingData).then((res) => res).catch((err) => err.response);
};

export { ServiceUpdateParking };