import axios from "axios"

async function UpdateSchedule(scheduleData, id){
    const url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/schedules/" + id;
    // console.log("infosSent", scheduleData);
    return axios.put(url, scheduleData).then((res) => res).catch((err) => err.response);
};

export { UpdateSchedule };