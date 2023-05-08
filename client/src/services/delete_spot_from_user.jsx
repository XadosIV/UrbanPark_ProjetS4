import axios from "axios"

async function DeleteSpotFromUser(id, token, infos) {
    const config = { 
        headers: {Authorization : `Bearer ${token}`}
    }
    //A UTILISER A UN MOMENT
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users/" + id;
    //console.log(url, infos, config);
    return axios.put(url, infos).then(console.log).catch(console.log);
}

export { DeleteSpotFromUser }