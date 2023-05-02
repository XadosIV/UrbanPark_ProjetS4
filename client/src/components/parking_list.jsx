import React, { useState, useContext, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { ContextUser } from "../contexts/context_user";
import { Link } from "react-router-dom";
import { CutAddress, NeedS } from "../interface";
import { DeleteParking, authenticate, userFromToken } from "../services"
import ReactModal from 'react-modal';

export function ParkingList(parking) {
    /**
     * PutButton
     * Returns a button if value = true
     *
     * @param { boolean } value - Value if we want a button or not
     * @return { Link Button }
     */
    function PutButton(value) {
        if (value) {
            return (
            <Link to={`/parkings/${parking.parking.id}`} style={{textDecoration:"none"}}>
                <Button variant="contained" color="primary">Voir les places</Button>
            </Link>)
        }
    }

    const noPaste = (e) => {
		e.preventDefault();
		return false;
	}

    function test() {
        return <Example/>
    }

    var address = CutAddress(parking.parking.address);
    const [visible, setVisible] = useState(true);

    function Example() {
        const [isOpen, setIsOpen] = useState(false);

        const customStyles = {
            alignText:"center",
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

        const {userToken, setUserToken, userId } = useContext(ContextUser);
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
            console.log(infosUser.email, password)
            let fetchT = await fetchToken(infosUser.email, password);
            if(password){
                if(userToken === fetchT){
                    await DeleteParking(parking.parking.id)
                    setVisible((prev) => !prev)
                }
            }
        }
        
        return (
            <div>
                <Button variant="contained" color="primary" style={{marginTop:"20px", backgroundColor:"red"}} onClick={() => setIsOpen(true)}>Supprimer ce parking</Button>
                <ReactModal
                    isOpen={isOpen}
                    contentLabel="Example Modal"
                    onRequestClose={() => setIsOpen(false)}
                    style={customStyles}>
                    <p style={{color:"red", alignText:"center"}}>
                        ATTENTION !</p>Vous êtes sur le point de supprimer le parking {parking.parking.name} ! 
                        <br/> Veuillez entrer votre mot de passe afin de le supprimer
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
                            >Suprrimer le parking</Button>
                        </div>
                    </form>
                    { wrongInput && <p className="err_message"> { errMessage } </p>}
                </ReactModal>
            </div>
            );
        }

	return (
        <div>
        {visible && (
        <div className="list-item">	 
            <div>
                <h2>Parking {parking.parking.name} ({parking.parking.id})<br/>{parking.parking.floors} étage{NeedS(parking.parking.floors)}</h2>    
                <p>{address[0]}</p>
                <p>{address[1]}</p>
            </div>
            <div className="button-parking">               
                <p>{parking.parking.nbPlaceLibre} places restantes / {parking.parking.nbPlaceTot}</p> 
                {PutButton(parking.button)}
                {parking.admin && <Example/>}
            </div>
        </div>)}</div>)
}
