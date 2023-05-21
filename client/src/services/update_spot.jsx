import axios from "axios"

async function ServiceUpdateSpot(spotData, id){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spot/" + id;
    return axios.put(url, {toggle_type:spotData}).then((res) => res).catch((err) => err.response);
};

export { ServiceUpdateSpot };