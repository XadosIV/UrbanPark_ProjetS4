import axios from "axios"

async function GetDemandeAbo(){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/users?role=Abonné&id_spot=%00";
    return axios.get(url).then((res) => res.data).catch((err) => err.response);
};

export { GetDemandeAbo };