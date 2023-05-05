import { Button } from '@mui/material';
import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { SpotName, NbFloors } from '../interface';
import TP from "../services/take_parking";
import { getAllSpotsTyped } from '../services';

export function DemandeAbo({ infos }){

    const placeNull = {
        id_park: "",
        number: undefined,
        floor: undefined
    };
    const [ place, setPlace ] = useState(placeNull);
    const [ park, setPark ] = useState({});
    const emptyOpt = [{value: "", label: "non-assigné"}];
    const [ optFloors, setOptFloors ] = useState(emptyOpt);
    const [ optNum, setOptNum ] = useState([]);
    const [ dataSpot, setDataSpot ] = useState([]);
    const [ affErrMessage, setAffErrMessage ] = useState(false);
    const [ errMessage, setErrMessage ] = useState("");

    useEffect(() => {
        async function fetchPark(parking_demende){
            let resPark = await TP.TakeParking(parking_demende);
            console.log("resPark", resPark);
            setPark(resPark[0]);
            const name = "id_park";
            const value = resPark[0].id;
            setPlace(values => ({...values, [name]: value}))
        }
        fetchPark(infos.id_park_demande);
    }, [])

    useEffect(() => {
        let newOptFloors = NbFloors(park.floors, emptyOpt);
        console.log("newOptFloor", newOptFloors);
        setOptFloors(newOptFloors);
    }, [park.floors])

    useEffect(() => {
        async function fetchNewSpots(parking_id, etage){
            let resGetSpot = await getAllSpotsTyped(parking_id, "Abonné", etage);
            console.log("spots", resGetSpot);
            let newSpots = resGetSpot.data.filter(spot => (spot.id_user === null) && (spot.id_user_temp === null));
            console.log("filter spot", newSpots);
            setDataSpot(newSpots);
            let newNumOpt = [];
            newSpots.forEach(spot => {
                newNumOpt.push({value:spot.number.toString(), label:"numéro " + spot.number.toString()});
            });
            console.log("newNumOpt", newNumOpt);
            setOptNum(newNumOpt);
        }
        if(place.floor){
            fetchNewSpots(park.id, place.floor);
        }else{
            setOptNum([])
        }
    }, [park.id, place.floor])

    const handlleSubmit = async (e) => {
        e.preventDefault();
        console.log("submit_E", e);
    }

    const handleChangeSelect = (selectedOptions, name) => {
        console.log("selectedOptions", selectedOptions);
        console.log("name", name);
        if(name.name === "floor"){
            const name = "floor";
            const value = selectedOptions.value;
            setPlace(values => ({...values, [name]: value}))
        }
        if(name.name === "number"){
            const name = "number";
            const value = selectedOptions.value;
            setPlace(values => ({...values, [name]: value}))
        }
    }

    const reset = () => {
        setOptFloors(emptyOpt);
        setOptNum(emptyOpt);
        setAffErrMessage(false);
        setErrMessage("");
    }

    return (
        <li className='demande-abo-user'>
            <div className="main-content">
                <div>
                    <h3>{infos.first_name} {infos.last_name} - {infos.email}</h3>
                </div>
                <div>
                    { (place.number !== placeNull.number && place.floor !== placeNull.floor && place.id_park !== placeNull.id_park) ? SpotName(place) : <p> place non-attribué </p> }
                </div>                   
                <div>
                    <Popup
                        trigger={
                        <Button
                            className="UI-Button" 
                            variant="contained" 
                            color="primary"
                        > donner une place </Button>}
                        position='left center'
                        onClose={ () => reset() }
                    >{ close => (
                        <div className="form-div">
                            <h3 style={{textAlign:"center"}}> Assignement d'une place à { infos.first_name } { infos.last_name } <br/> Dans le parking : { park.name } </h3>
                            { affErrMessage && <p className='err-message'> { errMessage } </p> }
                            <form onSubmit={handlleSubmit} className="form">
                                    <Select
                                        name="floor"
                                        className="select-attr-spot"
                                        placeholder="Étage"
                                        options= { optFloors }
                                        defaultValue= { optFloors[0] }
                                        onChange={handleChangeSelect}
                                    />
                                    <Select
                                        name="number"
                                        className="select-attr-spot"
                                        placeholder="Numéro"
                                        options={ optNum }
                                        defaultValue={ optNum[0] }
                                        onChange={handleChangeSelect}
                                    />
                            </form>
                        </div>
                    )}
                    </Popup>
                </div>
                <div>
                    <Button
                        className="validation-button spu-close-popup" 
                        variant="contained" 
                        color="primary"
                    >Valider la demande</Button>
                </div>
            </div> 
        </li>
    );
};

