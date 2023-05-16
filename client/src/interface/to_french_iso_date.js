/**
 * ToFrenchISODate
 * Returns a string with the ISO date in french
 *
 * @param { Date } date - The date to transform
 * @return { String }
 */
export function ToFrenchISODate(date) {
    let res = "";
    date = date.toLocaleString().split(" ")
    let splitDate = date[0].split("/")
    for (let i = splitDate.length-1; i >= 0; i--) {
        res += splitDate[i]
        if (i !== 0) {
            res += "-"
        }
    }
    res += "T" + date[1]
    return res
}