import axios from "axios"

async function DeleteUser(id){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users/" + id;
    console.log(url);
    return axios.delete(url).then((res) => res).catch((err) => err.response);
};

export { DeleteUser };