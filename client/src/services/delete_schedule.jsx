import axios from "axios"

async function DeleteSchedule(id){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/schedule/" + id;
    return axios.delete(url).then((res) => res).catch((err) => err.response);
};

export { DeleteSchedule };