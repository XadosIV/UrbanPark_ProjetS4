import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { NbFloors } from "../interface"
import { CreationSpot } from "../services"
import Popup from 'reactjs-popup';
import Select from 'react-select';

export function NewSpotForm(props) {

    const [infos, setInfos] = useState({floor: 0, number: 0});

	const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const [textSelectFloor, setTextSelectFloor] = useState("Choisir un étage");

	const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

	const handlleSubmit = async (event) => {
		event.preventDefault();
		console.log(infos);
        setWrongInput(false);
        const res = await CreationSpot(infos);
        console.log(res);
        if(res.status === 200) {
            setWrongInput(true);
            setErrMessage("une erreur est survenue");
        }else{
            setWrongInput(true);
            setErrMessage(res.data.message);
        }
		
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
                <h3 style={{textAlign:"center"}}>Ajout d'une nouvelle place<br/> au parking : {props.name}</h3>
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
                { wrongInput && <p className="err_message"> { errMessage } </p>}
            </div>
        </Popup>
    )
}