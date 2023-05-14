/**
 * AllServices
 * Returns a lists of options for a Select React component composed of every type 
 *
 * @param { Array } list - List of service
 * @return { Array }
 */
export function AllServices(list) {
	if (!Array.isArray(list)) {
		list = [list]
	}
	var opt = []
	for (let i=0; i<list.length; i++) {
		opt.push({value:list[i].id, label:list[i].first_name + " " + list[i].last_name})
	}
	return opt
}
