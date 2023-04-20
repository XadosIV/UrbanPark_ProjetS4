import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Popup from 'reactjs-popup';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import 'react-datepicker/dist/react-datepicker.css'
import "../css/parking.css"

export function NewScheduleForm(props) {

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
        if ((nb2 < nb1 || nb2 < 0) && (nb2 != 0 || nb2 != "")) {
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
                id="last_spot"
                label="Numéro"
                type="text"
                name="last_spot"
                className="search"
                onChange={handleChange}
            />
        } else {
            return <TextField
                style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
                size="small"
                id="last_spot"
                label="Numéro"
                type="text"
                name="last_spot"
                className="search"
                onChange={handleChange}
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
        if (nb1<0 && (nb1 != 0 || nb1 != "")) {
            return <TextField
                error
                helperText="Chiffre négatif impossible"
                required
                style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
                size="small"
                id="first_spot"
                label="Numéro"
                type="text"
                name="first_spot"
                className="search"
                onChange={handleChange}
            />
        } else {
            return <TextField
            required
            style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
            size="small"
            id="first_spot"
            label="Numéro"
            type="text"
            name="first_spot"
            className="search"
            onChange={handleChange}
        />
        }
    }

    const [infos, setInfos] = useState({id_park: "", users: [], date_start: setHours(setMinutes(new Date(), 0), 17), date_end: setHours(setMinutes(new Date(), 0), 17), first_spot: 0, last_spot:0});

	const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

	const handleChange = (event) => {
        const name = event.target.name;
        const value = parseInt(event.target.value);
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
        /*event.preventDefault()
		console.log(infos);
        setWrongInput(false);
        if (infos.number >= 0) {
            if (infos.last_spot == 0) {
                const res = await CreationSpot(infos); 
                console.log(res);
                if (res.status === 200) {
                    setWrongInput(true);
                    setErrMessage("Place " + infos.id_park + infos.floor + "-" + infos.number + " créée");
                } else {
                    setWrongInput(true);
                    setErrMessage(res.data.message);
                }
            } else {
                let stock = infos.number
                if (infos.number<infos.last_spot) {
                    while (infos.number<=infos.last_spot && !wrongInput) {
                        const res = await CreationSpot(infos); 
                        console.log(res);
                        if (res.status === 200) {
                            infos.number++;
                        } else {
                            setWrongInput(true);
                            setErrMessage("Une place n'a pas pu être créée dû à : " + res.data.message);
                            infos.number = stock;
                            break;
                        }
                    }
                    if (infos.number-1 == infos.last_spot) {
                        infos.number = stock;
                        setWrongInput(true);
                        setErrMessage("Places " + infos.id_park + infos.floor + "-" + infos.number + " à " + infos.id_park + infos.floor + "-" + infos.last_spot + " créées");
                    }
                } else {
                    setWrongInput(true);
                    setErrMessage("Le premier numéro doit être inférieur au second");
                }
            }
        } else {
            setWrongInput(true);
            setErrMessage("La place créée ne peut pas être négative");
        }*/
	}

    console.log(infos)

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
            }}>Ajouter des créneaux de travail</Button>} position="left center" onClose={() => setWrongInput(false)}> 
            <div className="form_div">
                <h3 style={{textAlign:"center"}}>Ajout d'un nouveau créneau</h3>
                <form onSubmit={handlleSubmit} className="form">       
                    <Select 
                        id="id_park"
                        className="searchs-add"
                        options={props.options.parking} 
                        defaultValue={props.options.parking[0]}
                        name="id_park" 
                        isSearchable={false}
                        onChange={handleChangeSelect}
                    />
                    <Select
                        isMulti
                        name="users"
                        placeholder="Assigner à..."
                        options={props.options.service}
                        className="search-add-two "
                        onChange={handleChangeSelect}
                    />
                    <div className="numeros">
                        {ErrorOnFirstNumero(infos.first_spot)}
                        <p style={{margin:"7px 0 0 7px"}}>à</p>
                        {ErrorOnSecondNumero(infos.first_spot, infos.last_spot)}
                    </div>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", zIndex:1002}}>
                        <DatePicker
                            name="date_start"
                            selected={infos.date_start}
                            onChange={(date) => setInfos(values => ({...values, ["date_start"]: date}))}
                            showTimeSelect
                            minTime={setHours(setMinutes(new Date(), 0), 17)}
                            maxTime={setHours(setMinutes(new Date(), 30), 20)}
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        <p style={{margin:"0 7px 7px 7px"}}>à</p>
                        <DatePicker
                            name="date_end"
                            selected={infos.date_end}
                            onChange={(date) => setInfos(values => ({...values, ["date_end"]: date}))}
                            showTimeSelect
                            minTime={setHours(setMinutes(new Date(), 0), 17)}
                            maxTime={setHours(setMinutes(new Date(), 30), 20)}
                            dateFormat="MMMM d, yyyy h:mm aa"
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

