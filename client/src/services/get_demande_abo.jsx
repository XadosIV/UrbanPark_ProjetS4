import axios from "axios"

async function GetDemandeAbo(){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users?role=Abonné&id_spot=%00";
    console.log(url);
    return axios.get(url).then((res) => res).catch((err) => err.response);
};

export { GetDemandeAbo };