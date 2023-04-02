import React, { useEffect } from "react";

// interface personne {
//     name: string;
//     age: number;
// }

export function ExampleName(personne) {
	

	return(<div>
		<h1>Component Example</h1>
		<p>Component Example body </p>
		<p>name: {personne.name}</p>
		<p>age: {personne.age}</p>

	</div>)
}
