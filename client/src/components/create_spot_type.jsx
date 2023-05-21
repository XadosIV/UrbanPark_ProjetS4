import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import Popup from 'reactjs-popup';
import { CreationSpotType,TakeAllSpotTypes } from "../services"

export function CreateSpotType(props) {
    const [spotTypes, setSpotTypes] = useState([]);

    const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const [infos, setInfos] = useState({name: ""})

    const [noSubmit, setNoSubmit] = useState(true)

    const [update, setUpdate] = useState(true)

    useEffect(() => {
        TakeAllSpotTypes().then(res => {setSpotTypes(res);});
        setUpdate(false)
    }, [update]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

    const handleSet = () => {
        setNoSubmit(false)
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const handlleSubmit = async (event) => {
        event.preventDefault()
        setWrongInput(false);
        const res = await CreationSpotType(infos); 
        if (res.status === 200) {
            setWrongInput(true);
            setErrMessage('Type de place "' + infos.name + '" créé');
        } else {
            setWrongInput(true);
            setErrMessage(res.data.message);
        }
        setUpdate(true)
        await delay(2000);
        setNoSubmit(true)
    }


    return (
        <Popup className="popup-types" trigger={<Button className="dropbtn" style={{width: 200, height:"120%", backgroundColor:"blue", color:"yellow"}}>Types de places</Button>} onClose={() => setNoSubmit(true)} position="bottom center"> 
            <div >
                {spotTypes.map((type, index) => (<p key={index} style={{textAlign:"center"}}>{type.name}</p>))}
                {noSubmit && <Button variant="contained" color="primary" onClick={handleSet}
                    style={{
                    backgroundColor: "#FE434C",
                    borderColor: "transparent",
                    borderRadius: 20,
                    width: 200,
                    float:"right",
                    height:"20%"
                }}>Nouveau type de place</Button>}
                {!noSubmit && <div>
                    <form onSubmit={handlleSubmit} className="form">   
                        <div style={{zIndex:1007}}>   
                        <TextField
                            required
                            style = {{marginLeft:"10px", marginBottom:"12px", width:"190px", alignSelf:"center"}}
                            size="small"
                            id="name"
                            label="Nouveau type de place"
                            type="text"
                            name="name"
                            className="search"
                            onChange={handleChange}
                        />
                        </div> 
                        <Button
                            className="submit_button" 
                            variant="contained" 
                            color="primary" 
                            type="submit"
                        >Ajouter</Button>
                    </form>
                    { wrongInput && <p className="err-message" style={{maxWidth:"200px"}}> { errMessage } </p>}
                </div>}
            </div>
        </Popup>
    );
}
