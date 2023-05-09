import axios from "axios"

function userFromToken(token){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/user?token=" + token;
    //console.log(url);
    return axios.get(url).then((res => res));
}

export { userFromToken }