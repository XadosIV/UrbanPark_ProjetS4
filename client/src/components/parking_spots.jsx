import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import TP from "../services/take_parking";
import TAS from "../services/take_all_spots";
import TAST from "../services/take_all_spot_types"
import { SpotsList, ParkingList } from "../components";
import Select from 'react-select';
import Popup from 'reactjs-popup';
import "../css/parking.css"

export function ParkingSpots(props) {

    /**
     * NbFloors
     * Returns a lists of options for a Select React component composed of every floor 
     *
     * @param { integer } nb - Number of floors in the parking
     * @return { Array }
     */
    function NbFloors(nb) {
        var opt = [{value:"%", label:"Tous les étages"}]
        for (let i=0; i<nb; i++) {
            opt.push({value:i.toString(), label:"Étage " + i.toString()})
        }
        return opt
    }

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

    var baseValueFloorType = "%"
    var baseValueNumber = 0

    const [parkingsList, setParkingsList] = useState([]);

    const [list, setList] = useState([]);
    

    const [floor, setFloor] = useState(baseValueFloorType);

    const [textSelectFloor, setTextSelectFloor] = useState("Choisir un étage");

    const [inputTextSpotNumber, setInputTextSpotNumber] = useState(baseValueNumber);


    const [type, setType] = useState(baseValueFloorType);

    const [spotTypes, setSpotTypes] = useState([]);

    const [textSelectType, setTextSelectType] = useState("Choisir un type");


    const [secondFloor, setSecondFloor] = useState(baseValueFloorType);

    const [textSelectSecondFloor, setTextSelectSecondFloor] = useState("Choisir un étage");

    const [inputTextSpotSecondNumber, setInputTextSpotSecondNumber] = useState(baseValueNumber);

    useEffect(() => {
		TP.TakeParking(props.id.parking).then(res => setParkingsList(res));
        TAS.TakeAllSpots(props.id.parking).then(res => setList(res));
        TAST.TakeAllSpotTypes().then(res => setSpotTypes(res));
	}, []);

    var optionsFloor = []
    parkingsList.map((parking) => (
        optionsFloor = NbFloors(parking.floors)
    ))

    var optionsType = AllTypes(spotTypes)

    let handleChange = (funText, funSet, text, id) => { 
        return (e) => {
            funSet(e.value); 
            if (e.value == baseValueFloorType) {
                funText("Tous les " + text.toLowerCase());
                if (id) {
                    document.getElementById(id).className = "search-second"
                    if (document.getElementById("number2").classList.contains("search-second")) {
                        document.getElementById("text2").className = "search-second"
                    }
                    setSecondFloor(baseValueFloorType)
                    setTextSelectSecondFloor("Choisir un étage")
                }
            } else {
                funText(text.substring(0, text.length - 1) + " " + e.value);
                if (id) {
                    document.getElementById(id).className = "search"
                    document.getElementById("text2").className = "search"
                }
            }
        }
    }

    let inputHandler = (fun, id) => { 
        return (e) => {
            fun(e.target.value.toLowerCase());
            if (e.target.value == baseValueNumber) {
                if (id) {
                    document.getElementById(id).className = "search-second"
                    if (document.getElementById("floor2").classList.contains("search-second")) {
                        document.getElementById("text2").className = "search-second"
                    }
                    setInputTextSpotSecondNumber(baseValueNumber)
                    document.getElementById("searchbarNumber2").value = ""
                }
            } else {
                if (id) {
                    document.getElementById(id).className = "search"
                    document.getElementById("text2").className = "search"
                }
            }
        }
    }

	return(<div>
        <div style={{marginTop:"30px", marginBottom:"30px"}}>
            {
                parkingsList.map((parking) =>
                    <ParkingList parking={parking} button={false}/>
                )
            }
        </div>
        <div className="all-searchs">    
            <div className="search">
                <Select options={optionsType} placeholder={textSelectType} value={type} onChange={handleChange(setTextSelectType, setType, "Types")}/>
            </div>
            <div className="search">
                <Select options={optionsFloor} placeholder={textSelectFloor} value={floor} onChange={handleChange(setTextSelectFloor, setFloor, "Étages", "floor2")}/>
            </div>
            <div className="search">
                <TextField
                    style = {{marginBottom:"20px", width:"200px", alignSelf:"center"}}
                    size="small"
                    id="searchbarNumber"
                    label="Numéro de la place..."
                    type="text"
                    name="searchbarNumber"
                    onChange={inputHandler(setInputTextSpotNumber, "number2")}
                />
            </div>

            <div className="search-second" id="text2">
                <p style={{marginTop:"-5px", textAlign:"center"}}>Choisir toutes les <br/>places entre :</p>
            </div>
            <div className="search-second" id="floor2">
                <Select options={optionsFloor} placeholder={textSelectSecondFloor} value={secondFloor} onChange={handleChange(setTextSelectSecondFloor, setSecondFloor, "Étages")}/>
            </div>
            <div className="search-second" id="number2"> 
                <TextField
                    style = {{marginBottom:"20px", width:"200px", alignSelf:"center"}}
                    size="small"
                    id="searchbarNumber2"
                    label="Numéro de la place..."
                    type="text"
                    name="searchbarNumber2"
                    defaultValue=""
                    onChange={inputHandler(setInputTextSpotSecondNumber)}
                />
            </div>
        </div>
        <SpotsList list={list} inputFloor={floor} inputNumber={inputTextSpotNumber} inputType={type} inputSecondFloor={secondFloor} inputSecondNumber={inputTextSpotSecondNumber}/>
        
        <Popup trigger={<Button variant="contained" color="primary" 
            style={{
                backgroundColor: "#FE434C",
                borderColor: "transparent",
                borderRadius: 20,
                width: "16%",
                marginLeft: "42%",
                height:"10%",
                marginBottom:"50px"
            }}>Ajouter des places</Button>} position="bottom center">
            <div></div>
        </Popup>
    </div>)
}
