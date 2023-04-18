import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Popup from 'reactjs-popup';

export function NewSpotForm(props) {

    const [infos, setInfos] = useState({mail: props.mail, password: ""});
	const [wrongInput, setWrongInput] = useState(false);

	const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

	const handlleSubmit = async (event) => {
		/*event.preventDefault();
		console.log(infos);
		const data = {identifier: infos.mail, password: infos.password};
		const res = await authenticate(data);
		if(res.status === 200){
			console.log(res);
			const userData = await userFromToken(res.data.token);
			console.log(userData.data);
			if(userData.data.length === 1){
				const contextData = {
					id: userData.data[0].id,
					token: res.data.token,
					role: userData.data[0].role
				};
				updateContext(contextData);
			}
		}else{
			setWrongInput(true);
		}*/
	}

    return (
        <Popup trigger={<Button variant="contained" color="primary" 
            style={{
                backgroundColor: "#FE434C",
                borderColor: "transparent",
                borderRadius: 20,
                width: "16%",
                marginLeft: "42%",
                height:"10%",
                marginBottom:"100px"
            }}>Ajouter des places</Button>} position="right center">
            <div className="form_div">
                <form onSubmit={handlleSubmit} className="form">
                    <div className="inputs_divs">
                    <TextField
                        required
                        id="mail"
                        label="mail"
                        type="text"
                        name="mail"
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        id="password"
                        label="mot de passe"
                        type="password"
                        name="password"
                        onChange={handleChange}
                    />
                    </div>
                    <Button
                        className="submit_button" 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                    >connexion</Button>
                </form>
            </div>
        </Popup>
    )
}