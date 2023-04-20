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
            opt.push({value:list[i].name.toString(), label:"Type " + list[i].name.toLowerCase()})
        }
        return opt
    }
    
     /**
     * ErrorOnSecondNumber
     * Returns a TextField with an error or not depending if the second number is valid or not
     *
     * @param { integer } nb1 - The number of the first TextField
     * @param { integer } nb2 - The number of the second TextField
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
            disabled={!infos.checkedsecondNumber}
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
            disabled={!infos.checkedsecondNumber}
        />
        }
    }

    /**
     * ErrorOnFirstNumber
     * Returns a TextField with an error or not depending if the first number is valid or not
     *
     * @param { integer } nb1 - The number of the first TextField
     * @return { TextField }
     */
    function ErrorOnFirstNumber(nb1) {
        if (nb1 < 0 && (nb1 != 0 || nb1 != "")) {
            return <TextField
            error
            helperText="Chiffre négatif impossible"
            style = {{marginBottom:"12px", width:"200px", alignSelf:"center"}}
            className="search"
            size="small"
            id="searchbarNumber"
            label="Numéro de la place..."
            type="text"
            name="firstNumber"
            onChange={handleChangeTextField}
        />
        } else {
            return <TextField
            style = {{marginBottom:"12px", width:"200px", alignSelf:"center"}}
            className="search"
            size="small"
            id="searchbarNumber"
            label="Numéro de la place..."
            type="text"
            name="firstNumber"
            onChange={handleChangeTextField}
        />
        }
    }

    var baseValueFloorType = "%"
    var baseValueNumber = ""

    const [parkingsList, setParkingsList] = useState([]);

    const [list, setList] = useState([]);

    const [spotTypes, setSpotTypes] = useState([]);

    const [infos, setInfos] = useState({checkedsecondNumber:false, checkedsecondFloor:false, type:baseValueFloorType, firstFloor: baseValueFloorType, secondFloor: baseValueFloorType, firstNumber: baseValueNumber, secondNumber: baseValueNumber})

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
        setInfos(values => ({...values, [name.substring(7)]: ""}))
    }

    const handleChangeSelects = (event, name) => {
        const value = event.value;
        setInfos(values => ({...values, [name]: value}))
    }

	return(<div>
        <div style={{marginTop:"30px", marginBottom:"30px"}}>
            {
                parkingsList.map((parking) =>
                    <ParkingList parking={parking} button={false}/>
                )
            }
        </div>
        
            <div style={{maxWidth:"500px", marginBottom:"10px"}}>
                <input type="checkbox" name="checkedsecondNumber" onChange={handleChangeChecks}/>Activer la sélection par section de places<br/>
                <input type="checkbox" name="checkedsecondFloor" onChange={handleChangeChecks}/>Activer la sélection par section d'étages
            </div>
           
        
        <div style={{display:"flex", flexDirection:"row"}}>
            <form className="all-searchs">
                <Select 
                    className="front-search"
                    options={optionsType} 
                    defaultValue = {optionsType[0]}
                    name="type" 
                    onChange={event => handleChangeSelects(event, "type")}
                />
                <Select 
                    className="front-search"
                    options={optionsFloor} 
                    defaultValue = {optionsFloor[0]}
                    name="firstFloor" 
                    onChange={event => handleChangeSelects(event, "firstFloor")}
                    isSearchable={false}
                />
                {ErrorOnFirstNumber(infos.firstNumber)}

                <p className="search" style={{marginTop:"-5px", textAlign:"center"}}>Choisir toutes les <br/>places entre :</p>
                <Select 
                    className="front-search-second"
                    options={optionsFloor.slice(infos.firstFloor+2)} 
                    defaultValue = {optionsFloor.slice(infos.firstFloor+2)[0]}
                    name="secondFloor" 
                    onChange={event => handleChangeSelects(event, "secondFloor")}
                    isSearchable={false}
                    isDisabled={!infos.checkedsecondFloor}
                />
                <div className="search"> 
                    {ErrorOnSecondNumber(infos.firstNumber, infos.secondNumber)}
                </div>
		    </form> 
            {
                parkingsList.map((parking) => (
                    <NewSpotForm floors={parking.floors} name={parking.name} options={{floor:optionsFloor, type:optionsType}} id={parking.id}/>
                ))
            }
        </div> 
        

        <SpotsList list={list} infos={infos}/>  
    </div>)
}
