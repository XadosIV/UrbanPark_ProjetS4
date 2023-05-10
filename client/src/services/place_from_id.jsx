import axios from "axios"

async function placeFromId(id_place) {
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spot/" + id_place;
    //console.log(url);
    return axios.get(url).then((res => res.data));
}

export { placeFromId }