import axios from "axios"

async function CreationParking(parkingData){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/parking";
    //console.log(JSON.stringify(parkingData));
    return axios.post(url, parkingData).then((res) => res).catch((err) => err.response);
};

export { CreationParking };