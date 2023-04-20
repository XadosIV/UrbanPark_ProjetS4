import axios from "axios"

async function CreationSpot(spotData){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spots";
    console.log(JSON.stringify(spotData));
    return axios.post(url, spotData).then((res) => res).catch((err) => err.response);
};

export { CreationSpot };