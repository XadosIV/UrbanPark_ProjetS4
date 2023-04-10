import TA from "../services/take_by_role"

/**
 * Create a list of person according to the name of their role (gardien, agent de nettoyage, utilisateur)
 * @param { String } nom
 * @return { Promise list of User }
 */
const CreateListPerson = async (nom) => {
	const data = await TA.TakeAll(nom);
	return data
  }

export {
	CreateListPerson
}