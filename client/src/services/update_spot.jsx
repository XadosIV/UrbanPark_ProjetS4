import axios from "axios"

async function UpdateSpot(spotData, id){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/spot/" + id;
    //console.log(JSON.stringify(scheduleData));
    return axios.put(url, {toggle_type:spotData}).then((res) => res).catch((err) => err.response);
};

export { UpdateSpot };