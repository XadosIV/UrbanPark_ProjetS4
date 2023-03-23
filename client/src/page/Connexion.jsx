import React from "react";

import { ExampleName } from "../components";


//Connexion page
export function Connexion() {
	const [infos, setInfos] = useState({
		identifier: "",
		password:""
	})

	const handleChange = ({currentTarget}) => {
		const {value, name} = currentTarget;
		setInfos({
			...infos,
			[name]: value
		})
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		try{
			await authAPI.authenticate(infos)
		} catch(error){
			console.log(error)
		}
	}

	//Form seen by users
	return(<div>
		<h1>Test Page</h1>
		<p>Test page body </p>
		<ExampleName name="John" age={20} />
	</div>)
}