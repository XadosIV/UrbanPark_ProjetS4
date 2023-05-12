import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button } from "@mui/material";
import ReactModal from "react-modal";
import { TakeAllSpotTypes } from "../services";

export function ModifMultSpot (props) {
    const [ isOpen, setIsOpen ] = useState(false);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        async function fetchAlloptTypes(){
            let allTypes = await TakeAllSpotTypes();
            let optTypes = []
            allTypes.forEach(t => {
                optTypes.push({value: t.name, label: t.name})
            });
            setTypes(optTypes);
        }
        fetchAlloptTypes();
    }, [])

    const customStyles = {
        overlay: {
            zIndex : 100000
        },
        content: {
            top: '35%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection:"column",
            marginRight: '-50%',
            width: '40%',
            height: '40%',
            transform: 'translate(-40%, -10%)'
        },
    };

    const handleChangeSelect = (e) => {
        let newTypes = [];
        e.forEach(t => {
            newTypes.push(t.value);
        });
        props.callbackSetTypes(newTypes);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let clear = e.nativeEvent.submitter.id === "clear";
        props.callbackHandleSubmit(clear);
        setIsOpen(false);
    }
    
	return (<div>
        <Button 
            variant="contained" 
            color="secondary" 
            style={{marginTop:"20px", backgroundColor:"red", width: "100%"}} 
            onClick={() => setIsOpen(true)}
        >
            Modifier les places selectionnées
        </Button>
        <ReactModal 
            ariaHideApp={false}
            isOpen={isOpen}
            contentLabel="modification-type-mult-spot"
            onRequestClose={() => setIsOpen(false)}
            style={customStyles}
        >
            <p>
                Les places selectionnées auront les types indiqués ajoutés ou retirés selon si elles le possédaient déjà ou non.
            </p>
            <p>
                Attention ! Il n'est pas possible de retirer le type 'Abonné' à une place attitré à un abonné, même temporairement
            </p>
            <form style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection:"column",
				width: "100%"}}
                onSubmit={ (e) => handleSubmit(e)}
            >
                <Select 
                    styles={{
                        width:"50%"
                    }}
                    isMulti
                    name="types"
                    placeholder="Choisir des types"
                    options={types}
                    maxMenuHeight={150}
                    onChange={(e) => handleChangeSelect(e)}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    id="toggle"
                    style={{marginTop:"20px", backgroundColor:"#32CD32", width: "100%"}} 
                    type="submit"
                >
                    confirmer
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    id="clear"
                    style={{marginTop:"20px", backgroundColor:"red", width: "100%"}} 
                    type="submit"
                >
                    supprimer tous les types
                </Button>
            </form>
        </ReactModal>
    </div>)
}