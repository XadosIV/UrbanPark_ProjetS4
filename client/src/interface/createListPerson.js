import listPerson from "../services/listPerson"

const creaListPerson = async (nom) => {
	const data = await listPerson.takeAll(nom);
	return data
  }

export {
	creaListPerson
}