import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import TP from "../services/take_parking";
import TAS from "../services/take_all_spots";
import TAST from "../services/take_all_spot_types"
import { SpotsList, ParkingList, NewSpotForm, AdminVerif } from "../components";
import { NbFloors, GetSpotsFromFilter } from "../interface"
import Select from 'react-select';
import "../css/parking.css"
import { useContext } from "react";
import { userFromToken, DeleteSpot } from "../services";
import { ContextUser } from "../contexts/context_user";

export function ParkingSpots(props) {

    function Callback(childData) {
        setUpdate(childData)
    }

    function CallbackDelete(childData) { 
        var deleted = 0;
        const forLoop = async _ => {
            for (let spot of GetSpotsFromFilter(list, infos)) {
                const res = await DeleteSpot(spot.id)
                if (res.status === 200) {
                    deleted++;
                }
            }
        }
        forLoop().then(() => {
            if (deleted === GetSpotsFromFilter(list, infos).length) {
                setUpdate(childData)
            }
        })
    }

    const { userToken } = useContext(ContextUser);
	const [ roleUser, setRoleUser ] = useState("");
    const admin = roleUser === "Gérant";

	useEffect(() => {
        async function fetchUserInfos() {
            const resUserToken = await userFromToken(userToken);
            setRoleUser(resUserToken.data[0].role);
        }
        fetchUserInfos();
    }, [userToken]);

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
        if (nb2 < nb1 && nb2 !== 0 && nb2 !== "" && infos.checkedsecondNumber) {
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
        if (nb1 < 0 && (nb1 !== 0 || nb1 !== "")) {
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

    /**
     * NewSecondOptions
     * Returns a list of select react options for the second select - Without the ones used by the first one
     *
     * @param { array } opts - The base list of options
     * @param { integer } floor - The floor of the first select
     * @return { array }
     */
    function NewSecondOptions(opts, floor) {
        if (floor !== "%") {
            return opts.slice(floor+2)
        } else {
            return []
        }
    }

    var baseValueFloorType = "%"
    var baseValueNumber = ""

    const [parkingsList, setParkingsList] = useState([]);

    const [list, setList] = useState([]);

    const [spotTypes, setSpotTypes] = useState([]);

    const [update, setUpdate] = useState(true);

    const [infos, setInfos] = useState({checkedsecondNumber:false, checkedsecondFloor:false, type:baseValueFloorType, firstFloor: baseValueFloorType, secondFloor: baseValueFloorType, firstNumber: baseValueNumber, secondNumber: baseValueNumber})

    useEffect(() => {
		TP.TakeParking(props.id.parking).then(res => setParkingsList(res));
        TAS.TakeAllSpots(props.id.parking).then(res => setList(res));
        TAST.TakeAllSpotTypes().then(res => setSpotTypes(res));
        setUpdate(false)
	}, [update]);

    var optionsFloor = []
    parkingsList.map((parking) => (
        optionsFloor = NbFloors(parking.floors, {value:"%", label:"Tous les étages"})
    ))

    var optionsType = AllTypes(spotTypes)
    
    const handleChangeTextField = (event) => {
        const name = event.target.name;
        var value = event.target.value;
        if (value !== "") {
            value = parseInt(value)
        }
        setInfos(values => ({...values, [name]: value}))
    }

    const handleChangeChecks = (event) => {
        const name = event.target.name;
        const value = !infos[name]
        var newVal = baseValueNumber;
        if (name === "checkedsecondFloor") {
            newVal = baseValueFloorType
        }
        var sub = name.substring(7)
        console.log(sub, stockDisable[sub])
        setInfos(values => ({...values, [name]: value}))
        if (infos[name]) {
            setInfos(values => ({...values, [sub]: newVal}))
            setStock(values => ({...values, [sub]: infos[sub]}))
        } else if (stockDisable[sub] !== baseValueFloorType && stockDisable[sub] !== baseValueNumber) {
            setInfos(values => ({...values, [sub]: stockDisable[sub]}))
        }
    }

    const handleChangeSelects = (event, name) => {
        var value = event.value;
        if ((name === "firstFloor" || name === "secondFloor") && value !== "%") {
            value = parseInt(value)
        }
        setInfos(values => ({...values, [name]: value}))
    }

    const addSpotSiAdmin = () => {
        if(admin){
            if(parkingsList){
                if(parkingsList.length === 1){
                    return <NewSpotForm floors={parkingsList[0].floors} name={parkingsList[0].name} options={{floor:optionsFloor, type:optionsType}} id={parkingsList[0].id} handleCallback={Callback}/>
                }
            }
        }
    }
    
    const delSpotSiAdmin = () => {
        if(admin){
            if(parkingsList){
                if(parkingsList.length === 1){
                    return <AdminVerif title="Supprimer toutes les places sélectionnées" text="Vous êtes sur le point de supprimer toutes les places ci dessous !" handleCallback={CallbackDelete}/>
                }
            }
        }
    }

    const [stockDisable, setStock] = useState({secondFloor:baseValueFloorType, secondNumber:baseValueNumber})

	return(<div>
        <div style={{marginTop:"30px", marginBottom:"30px"}}>
            {
                parkingsList.map((parking, index) =>
                    <ParkingList parking={parking} button={false} key={index} admin={admin} handleCallback={Callback}/>
                )
            }
        </div>
        
        <div style={{maxWidth:"500px", marginBottom:"10px"}}>
            <input type="checkbox" name="checkedsecondNumber" onChange={handleChangeChecks}/>Activer la sélection par section de places<br/>
            <input type="checkbox" name="checkedsecondFloor" onChange={handleChangeChecks}/>Activer la sélection par section d'étages
        </div>
        
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
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
                    options={NewSecondOptions(optionsFloor, infos.firstFloor)} 
                    defaultValue = {NewSecondOptions(optionsFloor, infos.firstFloor)[0]}
                    name="secondFloor" 
                    onChange={event => handleChangeSelects(event, "secondFloor")}
                    isSearchable={false}
                    isDisabled={!infos.checkedsecondFloor}
                />
                <div className="search"> 
                    {ErrorOnSecondNumber(infos.firstNumber, infos.secondNumber)}
                </div>
		    </form>
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
            {
                addSpotSiAdmin()
            }
            {
                delSpotSiAdmin()
            }    
            </div>
        </div>  

        <SpotsList list={list} infos={infos} handleCallback={Callback}/>  
    </div>)
}
