import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import TP from "../services/take_parking";
import TAS from "../services/take_all_spots";
import TAST from "../services/take_all_spot_types"
import { SpotsList, ParkingList, NewSpotForm } from "../components";
import { NbFloors } from "../interface"
import Select from 'react-select';
import "../css/parking.css"

export function ParkingSpots(props) {

    /**
     * AllTypes
     * Returns a lists of options for a Select React component composed of every type 
     *
     * @param { Array } list - List of types in the parking
     * @return { Array }
     */
    function AllTypes(list) {
        var opt = [{value:"%", label:"Tous les types"}]
        for (let i=0; i<list.length; i++) {
            opt.push({value:list[i].name.toLowerCase(), label:"Type " + list[i].name.toLowerCase()})
        }
        return opt
    }

    /**
     * ShowSecondValues
     * Change the class of second values to show them or not
     */
    function ShowSecondValues() {
        if (document.getElementById("number2")) {
            if (infos.checkedPlaces) {
                document.getElementById("number2").className = "search"
            } else {    
                document.getElementById("number2").className = "search-second"
                infos.secondNumber = baseValueNumber;
            }
        }
        if (document.getElementById("floor2")) {
            if (infos.checkedFloor) {
                document.getElementById("floor2").className = "search"
            } else {    
                document.getElementById("floor2").className = "search-second"
                infos.secondFloor = baseValueFloorType;
            }
        }
        if (document.getElementById("text2")) {
            if (infos.checkedFloor || infos.checkedPlaces) {
                document.getElementById("text2").className = "search"
            } else {
                document.getElementById("text2").className = "search-second"
            }
        }
    }
    
     /**
     * ErrorOnSecondNumber
     * Returns a TextField with an error or not depending if the second number is valid or not
     *
     * @param { integer } nb1 - The number of the first TextField
     * @param { integer } nb1 - The number of the second TextField
     * @return { TextField }
     */
    function ErrorOnSecondNumber(nb1, nb2) {
        if (nb2 < nb1 && (nb2 != 0 || nb2 != "")) {
            return <TextField
            error
            helperText="Chiffre supérieur au premier"
            style = {{marginBottom:"12px", width:"200px", alignSelf:"center"}}
            size="small"
            id="searchbarNumber2"
            label="Numéro de la place..."
            type="text"
            name="secondNumber"
            value={infos.secondNumber}
            onChange={handleChangeTextField}
        />
        } else {
            return <TextField
            style = {{marginBottom:"12px", width:"200px", alignSelf:"center"}}
            size="small"
            id="searchbarNumber2"
            label="Numéro de la place..."
            type="text"
            name="secondNumber"
            value={infos.secondNumber}
            onChange={handleChangeTextField}
        />
        }
    }

    var baseValueFloorType = "%"
    var baseValueNumber = ""

    const [parkingsList, setParkingsList] = useState([]);

    const [list, setList] = useState([]);

    const [spotTypes, setSpotTypes] = useState([]);

    const [textSelectType, setTextSelectType] = useState("Choisir un type");

    const [textSelectFloor, setTextSelectFloor] = useState("Choisir un étage");

    const [textSelectSecondFloor, setTextSelectSecondFloor] = useState("Choisir un étage");

    const [infos, setInfos] = useState({checkedPlaces:false, checkedFloor:false, type:baseValueFloorType, firstFloor: baseValueFloorType, secondFloor: baseValueFloorType, firstNumber: baseValueNumber, secondNumber: baseValueNumber})

    useEffect(() => {
		TP.TakeParking(props.id.parking).then(res => setParkingsList(res));
        TAS.TakeAllSpots(props.id.parking).then(res => setList(res));
        TAST.TakeAllSpotTypes().then(res => setSpotTypes(res));
	}, []);

    var optionsFloor = []
    parkingsList.map((parking) => (
        optionsFloor = NbFloors(parking.floors, {value:"%", label:"Tous les étages"})
    ))

    var optionsType = AllTypes(spotTypes)
    
    const handleChangeTextField = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

    const handleChangeChecks = (event) => {
        const name = event.target.name;
        const value = !infos[name]
        setInfos(values => ({...values, [name]: value}))
    }

    const handleChangeSelects = (event, name, text, fun) => {
        if (event.value == baseValueFloorType) {
            fun("Tous les " + text.toLowerCase());
        } else {
            fun(text.substring(0, text.length - 1) + " " +  event.value);
        }
        const value = event.value;
        setInfos(values => ({...values, [name]: value}))
    }

    ShowSecondValues()

	return(<div>
        <div style={{marginTop:"30px", marginBottom:"30px"}}>
            {
                parkingsList.map((parking) =>
                    <ParkingList parking={parking} button={false}/>
                )
            }
        </div>
        <div style={{maxWidth:"500px", marginBottom:"10px"}}>
            <input type="checkbox" name="checkedPlaces" onChange={handleChangeChecks}/>Activer la sélection par section de places<br/>
            <input type="checkbox" name="checkedFloor" onChange={handleChangeChecks}/>Activer la sélection par section d'étages
        </div>
        <form className="all-searchs">
                <Select 
                    className="front-search"
                    options={optionsType} 
                    placeholder={textSelectType} 
                    name="type" value={infos.type} 
                    onChange={event => handleChangeSelects(event, "type", "Types", setTextSelectType)}
                />
                <Select 
                    className="front-search"
                    options={optionsFloor} 
                    placeholder={textSelectFloor} 
                    name="firstFloor" 
                    value={infos.firstFloor} 
                    onChange={event => handleChangeSelects(event, "firstFloor", "Étages", setTextSelectFloor)}
                />
                <TextField
                    style = {{marginBottom:"12px", width:"200px", alignSelf:"center"}}
                    className="search"
                    size="small"
                    id="searchbarNumber"
                    label="Numéro de la place..."
                    type="text"
                    name="firstNumber"
                    onChange={handleChangeTextField}
                />


                <p className="front-search-second" id="text2" style={{marginTop:"-5px", textAlign:"center"}}>Choisir toutes les <br/>places entre :</p>

                <Select 
                    className="front-search-second" 
                    id="floor2"
                    options={optionsFloor.slice(parseInt(infos.firstFloor)+2)} 
                    placeholder={textSelectSecondFloor} 
                    name="secondFloor" value={infos.secondFloor} 
                    onChange={event => handleChangeSelects(event, "secondFloor", "Étages", setTextSelectSecondFloor)}
                />
            <div className="search-second" id="number2"> 
                {ErrorOnSecondNumber(infos.firstNumber, infos.secondNumber)}
            </div>
		</form>  

        <SpotsList list={list} infos={infos}/>
        {
            parkingsList.map((parking) => (
                <NewSpotForm floors={parking.floors} name={parking.name}/>
            ))
        }
        
    </div>)
}
