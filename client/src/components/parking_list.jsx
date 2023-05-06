import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { CutAddress, NeedS } from "../interface";
import { AdminVerif } from "../components"
import { DeleteParking } from "../services"
import { useLocation, useNavigate } from 'react-router-dom'

export function ParkingList(props) {

    const navigate = useNavigate();
    const location = useLocation();

    async function Callback(childData) {
        if (location.pathname.slice(0, -1) == "/parkings/") {
            navigate("/perso");
        }
        await DeleteParking(props.parking.id);
        props.handleCallback(childData)
    }

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
            <Link to={`/parkings/${props.parking.id}`} style={{textDecoration:"none"}}>
                <Button variant="contained" color="primary">Voir les places</Button>
            </Link>)
        }
    }

    const noPaste = (e) => {
		e.preventDefault();
		return false;
	}

    var address = CutAddress(parking.parking.address);
    const [visible, setVisible] = useState(true);

    function AdminVerif() {
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
                    contentLabel="Suppression"
                    onRequestClose={() => setIsOpen(false)}
                    style={customStyles}>
                    <p style={{color:"red", alignText:"center"}}>
                        ATTENTION !</p>Vous êtes sur le point de supprimer le parking {parking.parking.name} ! 
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
                            >Suprrimer le parking</Button>
                        </div>
                    </form>
                    { wrongInput && <p className="err_message"> { errMessage } </p>}
                </ReactModal>
            </div>
            );
        }

	return (
        <div className="list-item">	 
            <div>
                <h2>Parking {props.parking.name} ({props.parking.id})<br/>{props.parking.floors} étage{NeedS(props.parking.floors)}</h2>    
                <p>{address[0]}</p>
                <p>{address[1]}</p>
            </div>
            <div className="button-parking">               
                <p>{props.parking.nbPlaceLibre} places restantes / {props.parking.nbPlaceTot}</p> 
                {PutButton(props.button)}
                {props.admin && <AdminVerif title="Supprimer ce parking" text={"Vous êtes sur le point de supprimer le parking " + props.parking.name + " !"} handleCallback={Callback}/>}
            </div>
        </div>)
}
