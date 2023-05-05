import React, { useContext, useEffect, useState } from "react";
import { SpotName } from "../interface"
import { Button } from "@mui/material";
import { ContextUser } from "../contexts/context_user";
import { userFromToken, DeleteSpot, DeleteSpotFromUser, SetSpotFromUser } from "../services";
import { AdminVerif, User } from "../components"
import Popup from 'reactjs-popup';
import Select from 'react-select';
import TBR from "../services/take_by_role"
import TBS from "../services/take_by_spot"

export function Spot(props) {

    /**
     * AllSubs
     * Returns a lists of options for a Select React component composed of every subs
     *
     * @param { Array } list - List of subs
     * @return { Array }
     */
    function AllSubs(list) {
        var opt = []
        for (let i=0; i<list.length; i++) {
            opt.push({value:list[i].id, label:list[i].first_name + " " + list[i].last_name})
        }
        return opt
    }

    async function UserOfSpot(list, id_spot) {
        var get = await TBS.TakeBySpot(id_spot).then((res) => res)
        var result;
        if (get[0]) {
            for (let user of list) {  
                if (user.id === get[0].id) {
                    result = {label: get[0].first_name + " " + get[0].last_name, value:user.id}
                }
            }
            return result
        }
    }

    /**
     * HasSub
     * Return a button to assign a spot if there is "Abonné" type and no user
     * 
     * @param { Array of Spot Types } types - The types of the spot 
     * @param { Array of User } user - The user of the spot
     * @returns { Button }
     */
    function HasSub(types, user) {
        var res = false;
        if (types.length !== 0 && user == null) {
            for (let type of types) {
                if (type === "Abonné") {     
                    res = true;
                }
            }
        }
        if (res) {
            return <Button variant="contained" color="primary" 
            style={{
                backgroundColor: "#FE434C",
                borderColor: "transparent",
                borderRadius: 20,
                width: 160,
                float:"right",
                height:"10%",
                marginBottom:"5px"
            }}>Assigner cette place à un abonné</Button>;
        }  
    }

    /**
     * ChangeUserSpot
     * Return a button to click on and something else if clicked
     * 
     * @param { String } title - The title of the buton
     * @returns { JSX }
     */
    function ChangeUserSpot(title) {
        return (noSubmit && 
            <Button variant="contained" color="primary" onClick={handleSet}>
                {title}
            </Button>)
            || (!noSubmit && <div><hr/>
            Définitive<input
                type="checkbox"
                checked={gender === "definitive"}
                onChange={() => setGender("definitive")}
            />
            <input
                type="checkbox"
                checked={gender === "temporary"}
                onChange={() => setGender("temporary")}
            />Temporaire
            <form onSubmit={(e) => handlleSubmit(e, "changeSpot")} className="form">
                <Select 
                    id="user"
                    className="searchs-add"
                    options={AllSubs(subs)} 
                    defaultValue={defaultValue}
                    name="user" 
                    onChange={handleChangeSelect}
                />
                <Button
                    className="submit_button" 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                >Valider</Button>
            </form></div>)
    }

    async function CallbackDelete(childData) {
        props.handleCallback(childData)
        await DeleteSpot(props.spot.id);
    }

    const { userToken } = useContext(ContextUser);
	const [ roleUser, setRoleUser ] = useState("");
    const admin = roleUser === "Gérant";

    const [infos, setInfos] = useState({user:[]})

    const [subs, setSubs] = useState([])

    const [defaultValue, setDefault] = useState({})

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const [noSubmit, setNoSubmit] = useState(true)

    console.log(defaultValue)
    const [gender, setGender] = useState("definitive");

    const handleChangeSelect = (selectedOptions, name) => {
        const value = selectedOptions.value;
        setInfos(values => ({...values, [name.name]: value}))
    }

	useEffect(() => {
        async function fetchUserInfos() {
            const resUserToken = await userFromToken(userToken);
            setRoleUser(resUserToken.data[0].role);
            //console.log("token", resUserToken.data[0])
        }
        fetchUserInfos();
    }, [userToken]);

    useEffect(() => {
        TBR.TakeByRole("Abonné").then(res => {
            setSubs(res);
            UserOfSpot(res, props.spot.id).then((data) => {
                if (data) {
                    setDefault(data)
                }
            })
        })
    }, [])

    const handleSet = () => {
        setNoSubmit(false)
    }

    const handlleSubmit = async (event, type) => {
        async function DSFU(id, change) {
            await DeleteSpotFromUser(id, userToken, change)
        }
        async function SSFU(id_user, change) {
            await SetSpotFromUser(id_user, userToken, change)
        }
        event.preventDefault()
        setWrongInput(false);
        var toModif = {id_spot:props.spot.id}
        if (gender === "temporary") {
            toModif = {id_spot_temp:props.spot.id}
        }
        if (type === "changeSpot") {
            TBS.TakeBySpot(props.spot.id).then(res => {
                DSFU(res[0].id, {id_spot:null});
            })
        } else if (type === "changeSpotTemp") {
            TBS.TakeBySpot(props.spot.id).then(res => {
                DSFU(res[0].id, {id_spot_temp:null});
            })
        }
        SSFU(infos.user, toModif);

        setErrMessage("Modification prise en compte.")
        setWrongInput(true)
        props.handleCallback(true)
        await delay(2000);
        setNoSubmit(true)
    }

    var infosSpot;
    if (props.spot.id_user_temp != null) {
        infosSpot = <div style={{textAlign:"center"}}><p style={{textDecoration:"none", marginBottom:"10px", marginTop:"0px"}}>
                        Place attribuée temporairement à : <br/> {props.spot.first_name_temp} {props.spot.last_name_temp}</p>
                        {ChangeUserSpot("Changer")}
                    </div>
    } else if (props.spot.id_user != null) {
        infosSpot = <div style={{textAlign:"center"}}><p style={{textDecoration:"none", marginBottom:"10px", marginTop:"0px"}}>
                        Place attribuée à : <br/> {props.spot.first_name} {props.spot.last_name}</p>
                        {ChangeUserSpot("Changer")}
                    </div>
    } else {
        for (let type of props.spot.types) {
            if (type === "Abonné") {     
                infosSpot = <div style={{textAlign:"center"}}>
                        Cette place n'a pas d'abonné attitré
                        {ChangeUserSpot("Assigner")}
                    </div>
            }
            break;
        }  
    }
    if (!infosSpot) {
        infosSpot = <div style={{textAlign:"center"}}>Cette place est destinée à tous les utilisateurs</div>
    }

    var typesSpot = [];
    if (props.spot.types.length !== 0) {
        for (let type of props.spot.types) {
            typesSpot.push(<p><strong>-</strong> Place {type}</p>)
        }
    }

	return (<div className="spot">

        <Popup className="popup-spot" trigger={<Button variant="contained" color="primary" className="dropbtn" style={{width:"200px"}}>
                            Place {SpotName(props.spot)}
                        </Button>} position="bottom center" onOpen={() => {setNoSubmit(true);}} onClose={() => {setNoSubmit(true); setWrongInput(false);}}>
                {infosSpot}
                <hr/>
                {typesSpot}
                {HasSub(props.spot.types, props.spot.id_user)}
                { admin &&
                <Button variant="contained" color="primary" 
                style={{
                    backgroundColor: "#FE434C",
                    borderColor: "transparent",
                    borderRadius: 20,
                    width: 160,
                    float:"right",
                    height:"10%",
                    marginTop:"5px"
                }}>Ajouter un type à cette place</Button>}
                {admin && 
                <AdminVerif title="Supprimer cette place" text={"Vous êtes sur le point de supprimer la place " + SpotName(props.spot) + " !"} handleCallback={CallbackDelete}/>}

            </Popup>


    </div>)
}