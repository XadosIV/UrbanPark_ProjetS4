import axios from "axios"

async function DeleteNotification(id){
    if(id){
        const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/notification/" + id;
        return axios.delete(url).then((res) => res).catch((err) => err.response);
    }
};

export { DeleteNotification };