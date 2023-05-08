import React, { useState, useContext, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { ContextUser } from "../contexts/context_user";
import { authenticate, userFromToken } from "../services"
import ReactModal from 'react-modal';

export function AdminVerif(props) {

    const noPaste = (e) => {
		e.preventDefault();
		return false;
	}

    const [isOpen, setIsOpen] = useState(false);

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
            width: '60%',
            transform: 'translate(-40%, -10%)'
        },
    };

    const {userToken } = useContext(ContextUser);
    const [password, setPassword] = useState("")

    const [wrongInput, setWrongInput] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const [ infosUser, setInfosUser ] = useState({
        email: "",
        first_name: "",
        id: undefined,
        id_spot: null,
        id_spot_temp: null,
        last_name: "",
        role: "",
    });

    useEffect(() => {
        fetchUserInfos();
    }, [userToken]);

    useEffect(() => {
		const body = document.querySelector('body');
		body.style.overflow = isOpen ? 'hidden' : 'auto';
	}, [isOpen])

    const handleChangePass = (event) => {
        setPassword(event.target.value)
    }

    async function fetchUserInfos() {
        const resInfosUser = await userFromToken(userToken);
        // console.log("user", resInfosUser.data[0])
        if(resInfosUser.data[0]){
            setInfosUser(resInfosUser.data[0]);
        }
    }

    async function fetchToken(mail, password){
        const tokenData = {
            identifier: mail,
            password: password
        }
        const resToken = await authenticate(tokenData);
        // console.log("resToken", resToken);
        if(resToken.status === 200){
            return resToken.data.token;
        }else{
            setWrongInput(true);
            setErrMessage("Mot de passe invalide");
        }
    }

    const handlleSubmit = async (event) => {
        event.preventDefault()
        setWrongInput(false);
        let fetchT = await fetchToken(infosUser.email, password);
        if(password){
            if(userToken === fetchT){
                props.handleCallback(true)
                setIsOpen(false)
            }
        }
    }
    
    return (
        <div>
            <Button variant="contained" color="primary" style={{marginTop:"20px", backgroundColor:"red", width: "100%"}} onClick={() => setIsOpen(true)}>{props.title}</Button>
            <ReactModal
                ariaHideApp={false}
                isOpen={isOpen}
                contentLabel="Suppression"
                onRequestClose={() => setIsOpen(false)}
                style={customStyles}
            >
                <p style={{color:"red", alignText:"center"}}>
                    ATTENTION !
                </p>
                    {props.text}
                    <br/> Veuillez entrer votre mot de passe afin de valider cette action.
                    <form onSubmit={ handlleSubmit } name="form-modif-mdp">
                    <div className="input-div">
                        <div><TextField
                            required
                            id="password"
                            label="Mot de passe"
                            type="password"
                            name="password"
                            onPaste={ noPaste }
                            onChange={ handleChangePass }
                        /></div>
                        <Button 
                            className="submit_button"
                            variant="contained" 
                            color="primary" 
                            type="submit"
                        >{props.title}</Button>
                    </div>
                </form>
                { wrongInput && <p className="err_message"> { errMessage } </p>}
            </ReactModal>
        </div>
        );
    }