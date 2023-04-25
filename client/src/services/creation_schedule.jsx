import axios from "axios"

async function CreationSchedule(scheduleData){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/schedule";
    //console.log(JSON.stringify(scheduleData));
    return axios.post(url, scheduleData).then((res) => res).catch((err) => err.response);
};

export { CreationSchedule };