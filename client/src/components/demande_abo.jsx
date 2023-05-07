import { Button } from '@mui/material';
import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { DeleteUser, getAllSpotsFilter, updateInfoPerso, TakeParking } from '../services';
import { SpotName, NbFloors } from "../interface";

export function DemandeAbo({ infos, up }){

    const placeNull = {
        id_park: "",
        number: undefined,
        floor: undefined
    };
    const [ place, setPlace ] = useState(placeNull);
    const [ park, setPark ] = useState({});
    const [ dataAllSpots, setDataAllSpots ] = useState([]);
    const [ dataNewSpot, setDataNewSpot ] = useState({});
    const [ optFloors, setOptFloors ] = useState([]);
    const [ optNum, setOptNum ] = useState([]);
    const [ affErrMessage, setAffErrMessage ] = useState(false);
    const [ errMessage, setErrMessage ] = useState("");
    const [ changeFloor, setChangeFloor ] = useState(false);
    const [ popupP, setPopupP ] = useState(false);
    const [ popupV, setPopupV ] = useState(false);
    const [ popupR, setPopupR ] = useState(false);

    useEffect(() => {
        async function fetchPark(parking_demende){
            let resPark = await TakeParking(parking_demende);
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
            let params = [{type: "Abonné"}, {floor: etage}, {id_park: parking_id}];
            let resGetSpot = await getAllSpotsFilter(params);
            // console.log("spots", resGetSpot);
            let newSpots = resGetSpot.data.filter(spot => (spot.id_user === null) && (spot.id_user_temp === null));
            // console.log("filter spot", newSpots);
            setDataAllSpots(newSpots);
            let newNumOpt = [];
            newSpots.forEach(spot => {
                newNumOpt.push({value:spot.number.toString(), label:"Numéro " + spot.number.toString()});
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
        // console.log("valider", e);
        // console.log("place", place);
        async function promoteUser(){
            let params = [{floor: place.floor}, {number: place.number}, {id_park: place.id_park}];
            let myNewSpot = await getAllSpotsFilter(params);
            // console.log("myNewSpot", myNewSpot);
            if(myNewSpot.data.length === 1){
                let resPromoteUser = await updateInfoPerso({id_spot: myNewSpot.data[0].id, id: infos.id});
                // console.log("promoteUser", resPromoteUser);
                up();
            }else{
                setAffErrMessage(true);
                setErrMessage("veuillez assigner une place")
                togglePopupP()
            }
        }
        promoteUser();
    }

    const refuserDemande = (e) => {
        e.preventDefault();
        // console.log("refuser", e);
        // console.log("infos", infos);
        async function deleteDemnade(){
            let resDeleteDemande = await DeleteUser(infos.id);
            // console.log("resDelete", resDeleteDemande);
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
            // console.log("dataAllSpot", dataAllSpots);
            let setNewSpot = dataAllSpots.filter(spot => {
                return (spot.number === parseInt(selectedOptions.value)) && (spot.id_park === infos.id_park_demande) && (spot.floor === parseInt(place.floor))});
            // console.log("setNewSpot", setNewSpot);
            if(setNewSpot.length !== 1){
                setErrMessage("une erreure est survenue");
                setAffErrMessage(true);
            }else{
                setDataNewSpot(setNewSpot[0]);
                togglePopupP()
            }
        }
    }

    const togglePopupP = () => {
        setPopupR(false);
        setPopupV(false);
        setPopupP(!popupP);
    }
    const togglePopupR = () => {
        setPopupP(false);
        setPopupV(false);
        setPopupR(!popupR);
    }
    const togglePopupV = () => {
        setPopupR(false);
        setPopupP(false);
        setPopupV(!popupV);
    }

    const reset = () => {
        togglePopupP();
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
                <div className='spot-infos'>
                { (place.number !== placeNull.number && place.floor !== placeNull.floor && place.id_park !== placeNull.id_park) ? <SpotInfos spotInfos={dataNewSpot}/> : <p> Place non attribuée </p> }
                </div>
                <div>
                    <Button
                        className="UI-Button" 
                        variant="contained" 
                        color="primary"
                        onClick={() => togglePopupP()}
                    > donner une place </Button>
                                  
                    <Popup
                        open={ popupP }
                        closeOnDocumentClick
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
                    <Button
                        className="validation-button" 
                        variant="contained" 
                        color="success"
                        onClick={() => togglePopupV()}
                    >Valider la demande</Button>
                    <Popup
                        open={ popupV }
                        closeOnDocumentClick
                        onClose={() => togglePopupV()}
                    >
                        <div className='validation popup-div'>
                            <h2> Êtes vous sûr de vouloir accepter cette demande ? </h2>
                            <div><Button
                                className="validation-button" 
                                variant="contained" 
                                color="success"
                                onClick={validerDemande}
                                type='submit'
                            >Valider la demande</Button></div>
                        </div>
                    </Popup>

                    <Button
                        className="refusal-button" 
                        variant="contained" 
                        color="error"
                        onClick={() => togglePopupR()}
                    >refuser la demande</Button>
                    <Popup
                        open={ popupR }
                        closeOnDocumentClick
                        onClose={() => togglePopupR()}
                    >
                        <div className='refusal popup-div'>
                            <h2> Êtes vous sûr de vouloir refuser cette demande ? </h2>
                            <p> Cela entrainera sa suppression </p>
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

