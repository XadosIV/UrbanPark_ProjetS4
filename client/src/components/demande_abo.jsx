import { Button } from '@mui/material';
import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import { DeleteUser, getAllSpotsFilter, updateInfoPerso, TakeParking } from '../services';
import { NbFloors } from "../interface";
import { SpotInfos } from "../components"
import ReactModal from 'react-modal';

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
            setPark(resPark[0]);
            const name = "id_park";
            const value = resPark[0].id;
            setPlace(values => ({...values, [name]: value}))
        }
        fetchPark(infos.id_park_demande);
    }, [])

    useEffect(() => {
        let newOptFloors = NbFloors(park.floors);
        setOptFloors(newOptFloors);
    }, [park.floors])

    useEffect(() => {
        async function fetchNewSpots(parking_id, etage){
            let params = [{type: "Abonné"}, {floor: etage}, {id_park: parking_id}];
            let resGetSpot = await getAllSpotsFilter(params);
            let newSpots = resGetSpot.data.filter(spot => (spot.id_user === null) && (spot.id_user_temp === null));
            setDataAllSpots(newSpots);
            let newNumOpt = [];
            newSpots.forEach(spot => {
                newNumOpt.push({value:spot.number.toString(), label:"Numéro " + spot.number.toString()});
            });
            setOptNum(newNumOpt);
        }
        if(place.floor){
            fetchNewSpots(park.id, place.floor);
        }else{
            setOptNum([])
        }
    }, [changeFloor])

    useEffect(() => {
		const body = document.querySelector('body');
		body.style.overflow = popupP || popupR || popupV ? 'hidden' : 'auto';
	}, [popupP, popupR, popupV])

    const validerDemande = (e) => {
        e.preventDefault();
        async function promoteUser(){
            let params = [{floor: place.floor}, {number: place.number}, {id_park: place.id_park}];
            let myNewSpot = await getAllSpotsFilter(params);
            if(myNewSpot.data.length === 1){
                let resPromoteUser = await updateInfoPerso({id_spot: myNewSpot.data[0].id, id: infos.id});
                up();
            }else{
                setAffErrMessage(true);
                setErrMessage("Veuillez assigner une place")
                togglePopupP()
            }
        }
        promoteUser();
    }

    const refuserDemande = (e) => {
        e.preventDefault();
        async function deleteDemnade(){
            let resDeleteDemande = await DeleteUser(infos.id);
        }
        deleteDemnade();
        up();
    }

    const handleChangeSelect = (selectedOptions, name) => {
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
            let setNewSpot = dataAllSpots.filter(spot => {
                return (spot.number === parseInt(selectedOptions.value)) && (spot.id_park === infos.id_park_demande) && (spot.floor === parseInt(place.floor))});
            if(setNewSpot.length !== 1){
                setErrMessage("Une erreur est survenue");
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
        setOptNum([]);
        setAffErrMessage(false);
        setErrMessage("");
    }

    const customStyles = (color) => ({
        overlay: {
            zIndex : 100000
        },
        content: {
            top: '35%',
            left: '50%',
            right: 'auto',
            bottom: '15%',
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection:"column",
            marginRight: '-50%',
            width: '25%',
            heigth: '75%',
            transform: 'translate(-40%, -10%)',
            border: color
        },
    });

    return (
        <li className='demande-abo-user'>
            <div className="main-content">
                <div>
                    <h3>{infos.first_name} {infos.last_name} - {infos.email}</h3>
                </div>
                <div>
                { (place.number !== placeNull.number && place.floor !== placeNull.floor && place.id_park !== placeNull.id_park) ? <SpotInfos spotInfos={dataNewSpot}/> : <p> Place non attribuée </p> }
                </div>
                <div>
                    <Button
                        className="UI-Button" 
                        variant="contained" 
                        color="primary"
                        onClick={() => togglePopupP()}
                    > donner une place </Button>

                    <ReactModal
                        ariaHideApp={false}
                        isOpen={popupP}
                        onRequestClose={ () => reset() }
                        style={customStyles('solid rgb(20, 94, 168)')}
                    >              
                    <div>
                        <h3 style={{textAlign:"center"}}> Assignement d'une place à { infos.first_name } { infos.last_name } <br/> Dans le parking : { park.name } </h3>
                        { affErrMessage && <p className='err-message'> { errMessage } </p> }
                        <div className="form">
                                <Select
                                    name="floor"
                                    className="select-attr-spot"
                                    placeholder="Étage"
                                    options= { optFloors }
                                    onChange={handleChangeSelect}
                                    maxMenuHeight={220}
                                />
                                <Select
                                    name="number"
                                    className="select-attr-spot"
                                    placeholder="Numéro"
                                    options={ optNum }
                                    onChange={handleChangeSelect}
                                    maxMenuHeight={220}
                                />
                        </div>
                    </div>
                    </ReactModal>
                </div>
                <div>
                    <Button
                        className="validation-button" 
                        variant="contained" 
                        color="success"
                        onClick={() => togglePopupV()}
                    >Valider la demande</Button>
                    <ReactModal
                        ariaHideApp={false}
                        isOpen={popupV}
                        onRequestClose={ () => togglePopupV() }
                        style={customStyles('solid rgb(37, 100, 40)')}
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
                    </ReactModal>

                    <Button
                        className="refusal-button" 
                        variant="contained" 
                        color="error"
                        onClick={() => togglePopupR()}
                    >refuser la demande</Button>
                    <ReactModal
                        ariaHideApp={false}
                        isOpen={popupR}
                        onRequestClose={ () => togglePopupR() }
                        style={customStyles('solid rgb(167, 35, 35)')}
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
                    </ReactModal>
                </div>
            </div> 
        </li>
    );
};

