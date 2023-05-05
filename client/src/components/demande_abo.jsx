import { Button, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { SpotName, NbFloors } from '../interface';
import TP from "../services/take_parking";
import TAS from "../services/take_all_spots";

export function DemandeAbo({ infos, index }){

    const placeNull = {
        id_park: "",
        number: undefined,
        floor: undefined
    };
    const [ place, setPlace ] = useState(placeNull);
    const [ park, setPark ] = useState({});

    useEffect(() => {
        async function fetchPark(){
            let resPark = await TP.TakeParking(infos.id_park_demande);
            console.log("resPark", resPark);
            setPark(resPark[0]);
        }
        fetchPark();
    }, [infos.id_park_demande])

    function optFloors(){
        let optFloors = NbFloors(park.floors, false);
        console.log("optFloor", optFloors);
        return optFloors;
    }
    const opF = optFloors();

    const handlleSubmit = async (e) => {
        console.log("submit_E", e);
    }

    const handleChangeSelect = (selectedOptions, name) => {
        console.log("selectedOptions", selectedOptions);
        console.log("name", name);
    }

    const reset = () => {
        setPlace(placeNull);
    }

    return (
        <li key={ index } className='demande-abo-user'>
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
                    >
                        <div className="form-div">
                            <h3 style={{textAlign:"center"}}> Assignement d'une place à { infos.first_name } { infos.last_name } <br/> Dans le parking : { park.name } </h3>
                            <form onSubmit={handlleSubmit} className="form">
                                    <Select
                                        name="floor"
                                        className="search-add-two "
                                        placeholder="Choisir des types"
                                        options={ opF }
                                        defaultValue = {opF[0]}
                                        onChange={handleChangeSelect}
                                    />
                                    <Select
                                        name="number"
                                        className="search-add-two "
                                        placeholder="Choisir des types"
                                        options={["a", "z", 1]}
                                        onChange={handleChangeSelect}
                                    />
                                <Button
                                    className="submit_button" 
                                    variant="contained" 
                                    color="primary" 
                                    type="submit"
                                >Ajouter</Button>
                            </form>
                        </div>
                    </Popup>
                </div>
            </div> 
        </li>
    );
};

