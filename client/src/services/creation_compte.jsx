import axios from "axios"

async function creationCompte(userData){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/user";
    return axios.post(url, userData).then((res) => res).catch((err) => err.response);
};

export { creationCompte };