import React, { useContext, useEffect, useState } from "react";
import { ContextUser } from "../contexts/context_user";
import { userFromToken, placeFromId } from "../services";
import TP from "../services/take_parking";
import { SpotName } from "../interface/spot_name";

export function PagePersoAbonne(){
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
            if(maPlace.id_park !== ""){
                console.log("idP", maPlace);
                const resParking = await TP.TakeParking(maPlace.id_park);
                setParkPlace(resParking[0]);
                console.log("parking", resParking[0])
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
                    setMaPlace(resMaPlace.data[0]);
                    console.log("place", resMaPlace.data[0]);
                }else{
                    setIsPlaceTemp(true);
                    const resMaPlaceTemp = await placeFromId(infosUser.id_spot_temp);
                    setMaPlace(resMaPlaceTemp.data[0]);
                    console.log("place_temp", resMaPlaceTemp.data[0]);
                }
            }
        }
        fetchMaPlace();
    }, [infosUser]);

    useEffect(() => {
        async function fetchUserInfos() {
            const resInfosUser = await userFromToken(userToken);
            setInfosUser(resInfosUser.data[0]);
            console.log("user", resInfosUser.data[0])
        }
        fetchUserInfos();
    }, [userToken]);

    const affSpotName = () => {
        if(maPlace.id_park && maPlace.floor && maPlace.number){
            return SpotName(maPlace);
        }else{
            return "Place Indisponible";
        }
    }
            
	return(
        <div className="div-place">
            { isPlaceTemp && <p className="msg-place-temp"> /!\ vous avez été assigné une place temporaire </p> }
            <div className="div-info-place">
                <ul>
                    <li> { parkPlace.name } </li>
                    <li> { parkPlace.address } </li>
                </ul>
                <div>
                    { affSpotName }
                </div>
                <ul>
                    { maPlace.types.map( (type, index) => <li key={index} > { type } </li> ) }
                </ul>
            </div>
            <div className="edt-place">
                {/* edt place */}
            </div>
        </div>
    )
}
