import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { CreationSpot } from "../services"
import Popup from 'reactjs-popup';
import Select from 'react-select';

export function NewSpotForm(props) {

    /**
     * ErrorOnSecondNumero
     * Returns a TextField with an error or not depending if the second numero is valid or not
     *
     * @param { integer } nb1 - The number of the first TextField
     * @param { integer } nb2 - The number of the second TextField
     * @return { TextField }
     */
    function ErrorOnSecondNumero(nb1, nb2) {
        var errorText;
        if ((nb2 < nb1 || nb2 < 0) && (nb2 !== 0 || nb2 !== "")) {
            if (nb2 < nb1) {
                errorText = "Chiffre supérieur au premier"
            } else {
                errorText = "Chiffre négatif impossible"
            }
            return <TextField
                error
                helperText={errorText}
                style = {{marginLeft:"10px", marginTop:"5px", width:"200px", alignSelf:"center"}}
                size="small"
                id="secondNumber"
                label="Numéro"
                type="text"
                name="secondNumber"
                className="search"
                onChange={handleChangeSecondNum}
            />
        } else {
            return <TextField
                style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
                size="small"
                id="secondNumber"
                label="Numéro"
                type="text"
                name="secondNumber"
                className="search"
                onChange={handleChangeSecondNum}
            />
        }
    }

    /**
     * ErrorOnFirstNumero
     * Returns a TextField with an error or not depending if the first numero is valid or not
     *
     * @param { integer } nb1 - The number of the first TextField
     * @return { TextField }
     */
    function ErrorOnFirstNumero(nb1) {
        if (nb1<0 && (nb1 !== 0 || nb1 !== "")) {
            return <TextField
                error
                helperText="Chiffre négatif impossible"
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
        } else {
            return <TextField
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
        }
    }

    const [infos, setInfos] = useState({floor: 0, number: 0, id_park: props.id, types:[]});

    const [secondNumber, setSecondNumber] = useState(0)

	const [wrongInput, setWrongInput] = useState(false);
    const [check, setCheck] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const handleChangeCheck = () => {
        setCheck(!check)
        if (document.getElementById("second-nums")) {
            if (document.getElementById("second-nums").classList.contains("numeros-two")) {
                document.getElementById("second-nums").className = "numeros"
            } else {
                document.getElementById("second-nums").className = "numeros-two"
                setSecondNumber(0)
            }
        }
    }

	const handleChange = (event) => {
        const name = event.target.name;
        const value = parseInt(event.target.value);
        setInfos(values => ({...values, [name]: value}))
    }

    const handleChangeSecondNum = (event) => {
        setSecondNumber(event.target.value)
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
        event.preventDefault()
        setWrongInput(false);
        if (infos.number >= 0) {
            if (secondNumber === 0) {
                const res = await CreationSpot(infos); 
                console.log(res);
                if (res.status === 200) {
                    setWrongInput(true);
                    setErrMessage("Place " + infos.id_park + infos.floor + "-" + infos.number + " créée");
                    props.handleCallback(true)
                } else {
                    setWrongInput(true);
                    setErrMessage(res.data.message);
                }
            } else {
                let stock = infos.number
                if (infos.number<secondNumber) {
                    while (infos.number<=secondNumber && !wrongInput) {
                        const res = await CreationSpot(infos); 
                        console.log(res);
                        if (res.status === 200) {
                            infos.number++;
                        } else {
                            setWrongInput(true);
                            setErrMessage(res.data.message);
                            infos.number = stock;
                            break;
                        }
                    }
                    if (infos.number-1 === secondNumber) {
                        infos.number = stock;
                        setWrongInput(true);
                        setErrMessage("Places " + infos.id_park + infos.floor + "-" + infos.number + " à " + infos.id_park + infos.floor + "-" + secondNumber + " créées");
                        props.handleCallback(true)
                    }
                } else {
                    setWrongInput(true);
                    setErrMessage("Le premier numéro doit être inférieur au second");
                }
            }
        } else {
            setWrongInput(true);
            setErrMessage("La place créée ne peut pas être négative");
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
                height:"100px",
                marginBottom:"100px"
            }}>Ajouter des places</Button>} position="left center" onClose={() => setWrongInput(false)}> 
            <div className="form_div">
                <h3 style={{textAlign:"center"}}>Ajout d'une nouvelle place<br/> au parking : {props.name}</h3>
                <form onSubmit={handlleSubmit} className="form">
                    <div style={{maxWidth:"200px", marginBottom:"10px"}}>
                        <input type="checkbox" name="checkedNumeros" onChange={handleChangeCheck}/>  Créer plusieurs places<br/>
                    </div>
                    <div className="inputs-divs">
                        <Select 
                            id="floor"
                            className="searchs-add"
                            options={props.options.floor.slice(1)} 
                            defaultValue={props.options.floor.slice(1)[0]}
                            name="floor" 
                            isSearchable={false}
                            onChange={handleChangeSelect}
                        />
                        <div className="numeros">
                            {ErrorOnFirstNumero(infos.number)}
                            <div className="numeros-two" id="second-nums">
                                <p style={{marginLeft:"7px", marginTop:"7px"}}>à</p>
                                {ErrorOnSecondNumero(infos.number, secondNumber)}
                            </div>
                        </div>
                        <Select
                            isMulti
                            name="types"
                            placeholder="Choisir des types"
                            options={props.options.type.slice(1)}
                            className="search-add-two "
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