import axios from "axios"

async function DeleteSpot(id){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spot/" + id;
    //console.log(JSON.stringify(id));
    return axios.delete(url).then((res) => res).catch((err) => err.response);
};

export { DeleteSpot };