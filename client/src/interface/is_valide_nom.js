const regexNomPrenom = new RegExp(/^[a-zéèêëçîïùüñöôõàâäãß]+(((['`-]?)( )?){1}[a-zéèêëçîïùüñöôõàâäãß])+$/, "gi");

export function isValideNom(nom){
    regexNomPrenom.lastIndex = 0;
    let res = regexNomPrenom.test(nom);
    regexNomPrenom.lastIndex = 0;
	return res;
}