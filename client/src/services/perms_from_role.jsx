import axios from "axios"

function permsFromRole(role){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/role?role=" + role;
    console.log(url);
    return axios.get(url).then(((res) => res));
}

export { permsFromRole }