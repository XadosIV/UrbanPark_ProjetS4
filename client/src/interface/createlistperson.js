import listPerson from "../services/takeallusers"

/**
 * Create a list of person according to the name of their role (gardien, agent de nettoyage, utilisateur)
 * @param { String } nom
 * @return { Promise list of User }
 */
const creaListPerson = async (nom) => {
	const data = await listPerson.takeAll(nom);
	return data
  }

export {
	creaListPerson
}