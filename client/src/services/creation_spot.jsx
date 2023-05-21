import axios from "axios"

async function CreationSpot(spotData){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spot";
    return axios.post(url, spotData).then((res) => res).catch((err) => err.response);
};

export { CreationSpot };