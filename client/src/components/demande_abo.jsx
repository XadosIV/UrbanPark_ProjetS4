import { Button } from '@mui/material';
import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { SpotName, NbFloors } from '../interface';
import TP from "../services/take_parking";
import { DeleteUser, getAllSpotsFilter } from '../services';

export function DemandeAbo({ infos, up }){

    const placeNull = {
        id_park: "",
        number: undefined,
        floor: undefined
    };
    const [ place, setPlace ] = useState(placeNull);
    const [ park, setPark ] = useState({});
    const [ optFloors, setOptFloors ] = useState([]);
    const [ optNum, setOptNum ] = useState([]);
    const [ affErrMessage, setAffErrMessage ] = useState(false);
    const [ errMessage, setErrMessage ] = useState("");
    const [ changeFloor, setChangeFloor ] = useState(false);

    useEffect(() => {
        async function fetchPark(parking_demende){
            let resPark = await TP.TakeParking(parking_demende);
            // console.log("resPark", resPark);
            setPark(resPark[0]);
            const name = "id_park";
            const value = resPark[0].id;
            setPlace(values => ({...values, [name]: value}))
        }
        fetchPark(infos.id_park_demande);
    }, [])

    useEffect(() => {
        let newOptFloors = NbFloors(park.floors);
        // console.log("newOptFloor", newOptFloors);
        setOptFloors(newOptFloors);
    }, [park.floors])

    useEffect(() => {
        async function fetchNewSpots(parking_id, etage){
            let params = [{type: "Abonné"}, {floor: etage}];
            let resGetSpot = await getAllSpotsFilter(parking_id, params);
            // console.log("spots", resGetSpot);
            let newSpots = resGetSpot.data.filter(spot => (spot.id_user === null) && (spot.id_user_temp === null));
            // console.log("filter spot", newSpots);
            let newNumOpt = [];
            newSpots.forEach(spot => {
                newNumOpt.push({value:spot.number.toString(), label:"numéro " + spot.number.toString()});
            });
            // console.log("newNumOpt", newNumOpt);
            setOptNum(newNumOpt);
        }
        if(place.floor){
            fetchNewSpots(park.id, place.floor);
        }else{
            setOptNum([])
        }
    }, [changeFloor])

    const validerDemande = (e) => {
        e.preventDefault();
        console.log("valider", e);
        console.log("place", place);
    }

    const refuserDemande = (e) => {
        e.preventDefault();
        console.log("refuser", e);
        console.log("infos", infos);
        async function deleteDemnade(){
            let resDeleteDemande = await DeleteUser(infos.id);
            console.log("resDelete", resDeleteDemande);
        }
        deleteDemnade();
        up();
    }

    const handleChangeSelect = (selectedOptions, name) => {
        // console.log("selectedOptions", selectedOptions);
        // console.log("name", name);
        if(name.name === "floor"){
            const name = "floor";
            const value = selectedOptions.value;
            setPlace(values => ({...values, [name]: value}));
            setChangeFloor(!changeFloor);
        }
        if(name.name === "number"){
            const name = "number";
            const value = selectedOptions.value;
            setPlace(values => ({...values, [name]: value}));
        }
    }

    const reset = () => {
        // console.log("place", place);
        // console.log("optFloor", optFloors);
        // console.log("optNum", optNum);
        // console.log("prking", park);
        // console.log("dataSpot", dataSpot);
        setOptNum([]);
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
                    >
                    <div className="div-attr-place">
                        <h3 style={{textAlign:"center"}}> Assignement d'une place à { infos.first_name } { infos.last_name } <br/> Dans le parking : { park.name } </h3>
                        { affErrMessage && <p className='err-message'> { errMessage } </p> }
                        <div className="form">
                                <Select
                                    name="floor"
                                    className="select-attr-spot"
                                    placeholder="Étage"
                                    options= { optFloors }
                                    onChange={handleChangeSelect}
                                />
                                <Select
                                    name="number"
                                    className="select-attr-spot"
                                    placeholder="Numéro"
                                    options={ optNum }
                                    onChange={handleChangeSelect}
                                />
                        </div>
                    </div>
                    </Popup>
                </div>
                <div>
                    <Popup
                        trigger={
                            <Button
                                className="validation-button" 
                                variant="contained" 
                                color="success"
                            >Valider la demande</Button>
                        }
                        position='left center'
                    >
                        <div className='validation popup-div'>
                            <h2> êtes vous sûre de vouloir accepter cette demande ? </h2>
                            <div><Button
                                className="validation-button" 
                                variant="contained" 
                                color="success"
                                onClick={validerDemande}
                            >Valider la demande</Button></div>
                        </div>
                    </Popup>

                    <Popup
                        trigger={
                            <Button
                                className="refusal-button" 
                                variant="contained" 
                                color="error"
                            >refuser la demande</Button>
                        }
                        position='left center'
                    >
                        <div className='refusal popup-div'>
                            <h2> êtes vous sûre de vouloir refuser cette demande ? </h2>
                            <p> cela entrainera sa suppression </p>
                            <div><Button
                                className="refusal-button" 
                                variant="contained" 
                                color="error"
                                onClick={refuserDemande}
                            >refuser la demande</Button></div>
                        </div>
                    </Popup>
                </div>
            </div> 
        </li>
    );
};

