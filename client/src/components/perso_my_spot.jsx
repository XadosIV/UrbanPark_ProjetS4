import React, { useContext, useEffect, useState } from "react";
import { ContextUser } from "../contexts/context_user";
import { userFromToken, placeFromId, TakeParking, getScheduleId } from "../services";
import { SpotName, CutAddress } from "../interface";

export function PersoMySpot(){
    const { userToken } = useContext(ContextUser);
    const [ infosUser, setInfosUser ] = useState({
        email: "",
        first_name: "",
        id: undefined,
        id_spot: null,
        id_spot_temp: null,
        last_name: "",
        role: "",
        id_park_demande:""
    });
    const [ maPlace, setMaPlace ] = useState({
        id: undefined,
	    number: undefined,
	    floor: undefined,
	    id_park: "",
	    id_user: undefined,
	    types:[]
    });
    const [ maPlaceTemp, setMaPlaceTemp ] = useState({
        id: undefined,
	    number: undefined,
	    floor: undefined,
	    id_park: "",
	    id_user: undefined,
	    types:[],
        next_schedule:undefined
    });
    const [ parkPlace, setParkPlace ] = useState({
        id: "",
        name: "",
        floors: undefined,
        address: ""
    });
    const [ isPlaceTemp, setIsPlaceTemp ] = useState(false);
    const [ nextSchedule, setNextSchedule ] = useState({
        id:undefined,
        type:"",
        date_start:"",
        date_end:"",
        parking:{},
        users:[],
        guests:[],
        spots:[]
    });

    useEffect(() => {
        async function fetchParking() {

            if (infosUser.id_park_demande){
                const resParking = await TakeParking(infosUser.id_park_demande);
                setParkPlace(resParking[0]);
            }
        }
        fetchParking();
    }, [infosUser]);

    useEffect(() => {
        async function fetchMaPlace() {
            if(infosUser.id_spot != null){
                const resMaPlace = await placeFromId(infosUser.id_spot);
                setMaPlace(resMaPlace);
            }
        }
        fetchMaPlace();
    }, [infosUser]);

    useEffect(() => {
        async function fetchMaPlaceTemp() {
            if(infosUser.id_spot_temp != null){
                setIsPlaceTemp(true);
                const resMaPlaceTemp = await placeFromId(infosUser.id_spot_temp);
                setMaPlaceTemp(resMaPlaceTemp);
            } else {
                setIsPlaceTemp(false);
            }
        }
        fetchMaPlaceTemp();
    }, [infosUser]);

    useEffect(() => {
        async function fetchUserInfos() {
            const resInfosUser = await userFromToken(userToken);
            setInfosUser(resInfosUser.data[0]);
        }
        fetchUserInfos();
    }, [userToken]);

    useEffect(() => {
        async function fetchNextSchedule(){
            if(maPlace.next_schedule){
                const resNextSchedule = await getScheduleId(maPlace.next_schedule);
                setNextSchedule(resNextSchedule.data);
            }
        }
        fetchNextSchedule();
    }, [maPlace])

    const affSpotName = () => {
        if((maPlace.id_park !== "") && (maPlace.floor !== undefined) && (maPlace.number !== undefined)){
            return "Ma place attitrée : " + SpotName(maPlace);
        }else{
            return "Place non attribuée, veuillez patienter.";
        }
    }

    const listeTypes = () => {
        if(maPlace.types.length !== 0){
            return maPlace.types.map( (type, index) =>  <li key={index} > Place { type.toLowerCase() } </li> ) 
        }else{
            return <li> Place abonné simple </li>
        }
    }
    
    const affNextSchedule = () => {
        if(nextSchedule.id){
            const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const optionsTime = { hour: "numeric", minute: "numeric", };
            let dateS = new Date(nextSchedule.date_start);
            let dateE = new Date(nextSchedule.date_end)
            if(dateS > Date.now()){
                return (<div className="elt-aff-place">
                    <h3> Le prochain nettoyage de votre place aura lieu aux horaires suivantes : </h3>
                    <ul>
                        <li>Du {dateS.toLocaleDateString(undefined, optionsDate) +" à "+ dateS.toLocaleTimeString(undefined, optionsTime)}</li>
                        <li>au {dateE.toLocaleDateString(undefined, optionsDate) +" à "+ dateE.toLocaleTimeString(undefined, optionsTime)}</li>
                    </ul>
                </div>)
            }else{
                return (<div className="elt-aff-place">
                    <h3> Le nettoyage de votre place se terminera :</h3>
                    <p>Le {dateE.toLocaleDateString(undefined, optionsDate) +" à "+ dateE.toLocaleTimeString(undefined, optionsTime)}</p>
                </div>)
            }
        }else{
            return(<div className="elt-aff-place">
                <h3> Aucun nettoyage de votre place planifié </h3>
            </div>)
        }
    }

	return(
        <div className="div-place">
            <div className="div-info-place">
                <div className="aff-place">
                    <h2 className="elt-aff-place">
                        { affSpotName() }
                    </h2>
                    <ul className="elt-aff-place">
                        <li> Parking { parkPlace.name } </li>
                        <li> { parkPlace.address !== "" ? CutAddress(parkPlace.address)[0] : "" } </li>
                        <li> { parkPlace.address !== "" ? CutAddress(parkPlace.address)[1] : "" } </li>
                    </ul>
                    <ul className="elt-aff-place">
                        {(maPlace.id_park !== "") && (maPlace.floor !== undefined) && (maPlace.number !== undefined) && listeTypes() }
                    </ul>
                    { affNextSchedule() }
                </div>
                <div>
                    { isPlaceTemp && <p className="msg-place-temp"> /!\ Une place temporaire vous a été assignée : Votre place temporaire est la place {SpotName(maPlaceTemp)} </p> }
                </div>
            </div>
        </div>
    )
}
