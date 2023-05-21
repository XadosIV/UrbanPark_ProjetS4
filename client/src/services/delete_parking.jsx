import axios from "axios"

async function DeleteParking(id){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/parking/" + id;
    return axios.delete(url).then((res) => res).catch((err) => err.response);
};

export { DeleteParking };