import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { CreationSpot } from "../services"
import Popup from 'reactjs-popup';
import Select from 'react-select';

export function NewSpotForm(props) {

    const [infos, setInfos] = useState({floor: 0, number: 0, id_park: props.id, types:[]});

	const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

	const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

    const handleChangeSelect = (selectedOptions, name) => {
        var value = [];
        if (selectedOptions.value) {
            value = selectedOptions.value
        } else {
            for (let option of selectedOptions) {
                value.push(option.value)
            }
        }
        setInfos(values => ({...values, [name.name]: value}))
    }

	const handlleSubmit = async (event) => {
		event.preventDefault();
		console.log(infos);
        setWrongInput(false);
        const res = await CreationSpot(infos);
        console.log(res);
        if(res.status === 200) {
            setWrongInput(true);
            setErrMessage("Place " + infos.id_park + infos.floor + "-" + infos.number + " créée");
        }else{
            setWrongInput(true);
            setErrMessage(res.data.message);
        }
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
            }}>Ajouter des places</Button>} position="right center" onClose={() => setWrongInput(false)}> 
            <div className="form_div">
                <h3 style={{textAlign:"center"}}>Ajout d'une nouvelle place<br/> au parking : {props.name}</h3>
                <form onSubmit={handlleSubmit} className="form">
                    <div className="inputs-divs">
                    <Select 
                        id="floor"
                        className="front-search-floor"
                        options={props.options.floor.slice(1)} 
                        defaultValue={props.options.floor.slice(1)[0]}
                        name="floor" 
                        isSearchable={false}
                        onChange={handleChangeSelect}
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
                        name="types"
                        placeholder="Choisir des types"
                        options={props.options.type.slice(1)}
                        className="front-search-second-add"
                        onChange={handleChangeSelect}
                    />
                    </div>
                    <Button
                        className="submit_button" 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                    >Ajouter</Button>
                </form>
                { wrongInput && <p className="err-message"> { errMessage } </p>}
            </div>
        </Popup>
    )
}