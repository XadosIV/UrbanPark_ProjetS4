import axios from "axios"

/**
 * TakeAllSchedulesAvailable
 * Returns a list of array [date_start, date_end] with all the moments everyone is available between 2 dates
 *
 * @param { JSON } infos - roles[], users[], date_start, date_end
 * @return { Promise list of User }
 */
async function TakeAllSchedulesAvailable(infos){
    var url = "http://" + process.env.REACT_APP_HOST + ":" + process.env.REACT_APP_PORTSERVER + "/api/reunion"
    if(!infos.users){
        infos.users = []
    }
    if(!infos.roles){
        infos.roles = []
    }
    if(infos.users.length > 0 || infos.roles.length > 0){
        return axios.get(url, {params: infos}).then((res) => res.data)
    }else{
        return [];
    }
}

export { TakeAllSchedulesAvailable };