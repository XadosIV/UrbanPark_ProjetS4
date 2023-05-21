import axios from "axios"

async function updateInfoPerso(infos) {
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users/" + infos.id;
    return axios.put(url, infos).then(res => res).catch(err => err.response);
}

export { updateInfoPerso }