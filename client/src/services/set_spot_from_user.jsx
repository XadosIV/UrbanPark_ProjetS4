import axios from "axios"

async function SetSpotFromUser(id, token, infos) {
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users/" + id;
    return axios.put(url, infos).then(res => res).catch(err => err.response);
}

export { SetSpotFromUser }