import { useContext, useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { ContextUser } from "../contexts/context_user";
import { userFromToken } from "../services";

export function PersonalInfos(){
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
    const [ newInfos, setNewInfos ] = useState({});
    const [ newMdp, setNewMdp ] = useState({});
    const [ affFormModifInfo, setAffFormModifInfo ] = useState(false);
    const [ errInput, setErrInput ] = useState(false);
    const [ errMessage, setErrMessage ] = useState("");

    useEffect(() => {
        async function fetchUserInfos() {
            const resInfosUser = await userFromToken(userToken);
            setInfosUser(resInfosUser.data[0]);
            //console.log("user", resInfosUser.data[0])
            const tmpUserInfos = {
                email: resInfosUser.data[0].email,
                first_name: resInfosUser.data[0].first_name,
                last_name: resInfosUser.data[0].last_name
            };
            // console.log("tmpUserInfos", tmpUserInfos);
            setNewInfos(tmpUserInfos);
        }
        fetchUserInfos();
    }, [userToken]);

    const noPaste = (e) => {
		e.preventDefault();
		return false;
	}

    const handleChangeInfos = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setNewInfos(values => ({...values, [name]: value}))
    }
    const handleChangeMdp = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setNewMdp(values => ({...values, [name]: value}))
    }

    const handlleSubmit = (e) => {
        e.preventDefault();
        console.log("userInfos", newInfos);
        console.log("newMdp", newMdp);
        console.log(e.target.name);
    }

    return(<div>
        <div className="div-info-user">
            <h3> { infosUser.first_name + " " + infosUser.last_name } </h3>
            <p> { infosUser.email } </p>
            <div className="div-button-place">
            <Button 
                classvariant="contained"
                color="primary"
                className="modif-infos-button"
                onClick={ () => {
                    affFormModifInfo ? setAffFormModifInfo(false) : setAffFormModifInfo(true);
                } }
                style={{
                    backgroundColor: "#145EA8",
                    color:"#FFFFFF"
                }}
            > modifier mes informations </Button>
            </div>
        </div>
        <div className="div-info-user" style={ affFormModifInfo ? {  } : { display: "none" }} >
            <div className="form-modif-infos">
            { affFormModifInfo && 
                // TODO changer pour avoir un form pour update le mdp et un autre pour le reste
                <div className="inputs_divs">
                <form  onSubmit={ handlleSubmit } name="form-modif-infos">
                        <div className="input-div">
                            <p className="p-form-title">Changer mes informations</p>
                            <TextField
                                id="email"
                                label="email"
                                type="text"
                                name="email"
                                defaultValue={infosUser.email}
                                onChange={ handleChangeInfos }
                            />
                            <TextField
                                id="first_name"
                                label="first_name"
                                type="text"
                                name="first_name"
                                defaultValue={infosUser.first_name}
                                onChange={ handleChangeInfos }
                            />
                            <TextField
                                id="last_name"
                                label="last_name"
                                type="text"
                                name="last_name"
                                defaultValue={infosUser.last_name}
                                onChange={ handleChangeInfos }
                            />
                            <TextField
                                required
                                id="password"
                                label="mot de passe"
                                type="password"
                                name="password"
                                onPaste={ noPaste }
                                onChange={ handleChangeInfos }
                            />
                            <Button 
                                className="submit_button"
                                variant="contained" 
                                color="primary" 
                                type="submit"
                            >valider les changements</Button>
                        </div>
                </form>
                <form onSubmit={ handlleSubmit } name="form-modif-mdp">
                <div className="input-div">
                    <p className="p-form-title">changer mon mot de passe</p>
                    <TextField
                        required
                        id="new_password"
                        label="nouveau mot de passe"
                        type="password"
                        name="new_password"
                        onPaste={ noPaste }
                        onChange={ handleChangeMdp }
                    />
                    <TextField
                        required
                        id="new_password_conf"
                        label="confirmation du nouveau mot de passe"
                        type="password"
                        name="new_password_conf"
                        onPaste={ noPaste }
                        onChange={ handleChangeMdp }
                    />
                    <TextField
                        required
                        id="password"
                        label="mot de passe"
                        type="password"
                        name="password"
                        onPaste={ noPaste }
                        onChange={ handleChangeMdp }
                    />
                    <Button 
                        className="submit_button"
                        variant="contained" 
                        color="primary" 
                        type="submit"
                    >modifier mon mot de passe</Button>
                    </div>
                </form>
                </div>
            }
            {   errInput &&
                <p className="err-input"> { errMessage } </p>
            }
            </div>
        </div>
    </div>)
}