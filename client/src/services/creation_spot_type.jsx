import axios from "axios"

async function CreationSpotType(spotTypeData){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/types";
    return axios.post(url, spotTypeData).then((res) => res).catch((err) => err.response);
};

export { CreationSpotType };