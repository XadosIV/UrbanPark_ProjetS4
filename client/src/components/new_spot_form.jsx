import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { NbFloors } from "../interface"
import Popup from 'reactjs-popup';
import Select from 'react-select';

export function NewSpotForm(props) {

    const [infos, setInfos] = useState({floor: 0, number: 0});

	const [wrongInput, setWrongInput] = useState(false);

    const [textSelectFloor, setTextSelectFloor] = useState("Choisir un étage");

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

    var optionsFloor = []
    optionsFloor = NbFloors(props.floors)

    const handleChangeSelect = (event, name) => {
        setTextSelectFloor("Étage " +  event.value);     
        const value = event.value;
        setInfos(values => ({...values, [name]: value}))
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
                    <Select 
                        id="floor"
                        className="front-search"
                        options={optionsFloor} 
                        placeholder={textSelectFloor} 
                        name="floor" 
                        value={infos.floor} 
                        onChange={event => handleChangeSelect(event, "floor")}
                    />
                    <TextField
                        required
                        style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
                        size="small"
                        id="number"
                        label="Numéro"
                        type="text"
                        name="number"
                        className="search"
                        onChange={handleChange}
                    />
                    <Select
                        isMulti
                        name="colors"
                        placeholder="Choisir des types"
                        options={optionsFloor}
                        className="front-search-second-add"
                    />
                    </div>
                    <Button
                        className="submit_button" 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                    >Ajouter</Button>
                </form>
            </div>
        </Popup>
    )
}