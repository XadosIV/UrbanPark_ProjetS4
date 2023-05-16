/**
 * AllNotNecessary
 * Returns a lists of options without the second parameters
 *
 * @param { Array } list - List of service
 * @param { Array } necessaryList - List of ids of not necessary options
 * @return { Array }
 */
export function AllNotNecessary(list, necessaryList) {
    var opt = []
    if (necessaryList.length === 0) {
        for (let user of list) {
            opt.push({value:user.id, label:user.first_name + " " + user.last_name})
        }
    } else {
        for (let user of list) {
            if (!(necessaryList.includes(user.id))) {
                opt.push({value:user.id, label:user.first_name + " " + user.last_name})
            }
        }       
    }
    return opt
}