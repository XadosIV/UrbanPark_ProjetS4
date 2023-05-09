import React, { useContext, useEffect, useState } from "react";
import { ContextUser } from "../contexts/context_user";
import { userFromToken, placeFromId, TakeParking } from "../services";
import { SpotName } from "../interface/spot_name";

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
    });
    const [ maPlace, setMaPlace ] = useState({
        id: undefined,
	    number: undefined,
	    floor: undefined,
	    id_park: "",
	    id_user: undefined,
	    types:[]
    });
    const [ parkPlace, setParkPlace ] = useState({
        id: "",
        name: "",
        floors: undefined,
        address: ""
    });
    const [ isPlaceTemp, setIsPlaceTemp ] = useState(false);

    useEffect(() => {
        async function fetchParking() {
            if(maPlace){
                // console.log("idP", maPlace);
                const resParking = await TakeParking(maPlace.id_park);
                // console.log("parking", resParking)
                setParkPlace(resParking[0]);
            }
        }
        fetchParking();
    }, [maPlace]);

    useEffect(() => {
        async function fetchMaPlace() {
            if(infosUser.id_spot != null){
                if(infosUser.id_spot_temp == null){
                    setIsPlaceTemp(false);
                    const resMaPlace = await placeFromId(infosUser.id_spot);
                    //console.log("place", resMaPlace);
                    setMaPlace(resMaPlace);
                }else{
                    setIsPlaceTemp(true);
                    const resMaPlaceTemp = await placeFromId(infosUser.id_spot_temp);
                    //console.log("place_temp", resMaPlaceTemp);
                    setMaPlace(resMaPlaceTemp);
                }
            }
        }
        fetchMaPlace();
    }, [infosUser]);

    useEffect(() => {
        async function fetchUserInfos() {
            const resInfosUser = await userFromToken(userToken);
            //console.log("user", resInfosUser)
            setInfosUser(resInfosUser.data[0]);
        }
        fetchUserInfos();
    }, [userToken]);

    const affSpotName = () => {
        if((maPlace.id_park !== "") && (maPlace.floor !== undefined) && (maPlace.number !== undefined)){
            return SpotName(maPlace);
        }else{
            return "Place non attribuée, veuillez patienter.";
        }
    }

    const listeTypes = () => {
        if(maPlace.types.length !== 0){
            return maPlace.types.map( (type, index) =>  <li key={index} > { type } </li> ) 
        }else{
            return <li> Place abonné simple </li>
        }
    }
            
	return(
        <div className="div-place">
            <div className="div-info-place">
                <div>
                    { isPlaceTemp && <p className="msg-place-temp"> /!\ Une place temporaire vous a été assignée </p> }
                </div>
                <div className="aff-place">
                    <h2>
                        { affSpotName() }
                    </h2>
                    <ul>
                        <li> { parkPlace.name } </li>
                        <li> { parkPlace.address } </li>
                    </ul>
                    <ul>
                        {(maPlace.id_park !== "") && (maPlace.floor !== undefined) && (maPlace.number !== undefined) && listeTypes() }
                    </ul>
                </div>
            </div>
            <div className="edt-place">
                {/* edt place */}
            </div>
        </div>
    )
}
