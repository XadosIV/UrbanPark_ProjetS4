import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import Popup from 'reactjs-popup';
import { CreationSpotType,TakeAllSpotTypes } from "../services"

export function CreateSpotType() {
    const [spotTypes, setSpotTypes] = useState([]);

    const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const [infos, setInfos] = useState({name: ""})

    useEffect(() => {
        TakeAllSpotTypes().then(res => {setSpotTypes(res);});
    }, []);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

    const handlleSubmit = async (event) => {
        event.preventDefault()
		console.log(infos);
        setWrongInput(false);
        const res = await CreationSpotType(infos); 
        console.log(res);
        if (res.status === 200) {
            setWrongInput(true);
            setErrMessage('Type de place "' + infos.name + '" créé');
        } else {
            setWrongInput(true);
            setErrMessage(res.data.message);
        }
    }


    return (
        <Popup className="popup-types" trigger={<Button className="dropbtn" style={{width: 200, height:"120%", backgroundColor:"blue", color:"yellow"}}>Types de places</Button>} position="bottom center"> 
            <div >
                {spotTypes.map((type, index) => (<p key={index} style={{textAlign:"center"}}>{type.name}</p>))}
                <Popup trigger={<Button variant="contained" color="primary"
                    style={{
                    backgroundColor: "#FE434C",
                    borderColor: "transparent",
                    borderRadius: 20,
                    width: 200,
                    float:"right",
                    height:"20%"
                }}>Nouveau type de place</Button>} position="right center" onClose={() => setWrongInput(false)}> 
                    <div className="form_div">
                        <h3 style={{textAlign:"center"}}>Ajout d'un nouveau type de place</h3>
                            <form onSubmit={handlleSubmit} className="form">   
                                <div style={{zIndex:1007}}>   
                                <TextField
                                    required
                                    style = {{marginLeft:"10px", marginBottom:"12px", width:"200px", alignSelf:"center"}}
                                    size="small"
                                    id="name"
                                    label="Numéro"
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
                        { wrongInput && <p className="err-message"> { errMessage } </p>}
                    </div>
                </Popup>
            </div>
        </Popup>
    );
}
