import { useContext, useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { ContextUser } from "../contexts/context_user";
import { userFromToken, updateInfoPerso, authenticate } from "../services";
import { isValideNom } from "../interface"

export function PersonalInfos(){
    const { userToken, setUserToken, userId } = useContext(ContextUser);
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
    const [ newEmail, setNewEmail ] = useState({});
    const [ affFormModifInfo, setAffFormModifInfo ] = useState(false);
    const [ errInput, setErrInput ] = useState(false);
    const [ errMessage, setErrMessage ] = useState("");

    async function fetchUserInfos() {
        const resInfosUser = await userFromToken(userToken);
        // console.log("user", resInfosUser.data[0])
        if(resInfosUser.data[0]){
            setInfosUser(resInfosUser.data[0]);
        }
    }
    
    useEffect(() => {
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
    const handleChangeEmail = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setNewEmail(values => ({...values, [name]: value}))
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
            setErrInput(true);
            setErrMessage("mot de passe invalide");
        }
    }

    function clearForm(form){
        for (let i = 0; i < form.length; i++) {
            let elem = form[i];  
            if(elem.tagName === "INPUT"){
                if(elem.type === "password" || elem.id === "email"){
                    elem.value = "";
                    elem.blur(); // ne marche pas
                }
            }
        }
    }

    const handlleSubmit = async (e) => {
        // console.log("event", e.target);
        e.preventDefault();
        // console.log("userInfos", newInfos);
        // console.log("newMdp", newMdp);
        let dataSent = {id: userId, token: userToken};
        let resUp;
        let pass;
        let nouvmail;
        let nouvpass;
        if(e.target.name === "form-modif-infos"){
            let bonLst = isValideNom(newInfos.last_name);
            let bonFst = isValideNom(newInfos.first_name);
            // console.log("fst", newInfos.first_name, bonFst);
            // console.log("lst", newInfos.last_name, bonLst);
            if(bonFst && bonLst){
                dataSent = {
                    ...dataSent,
                    first_name: newInfos.first_name,
                    last_name: newInfos.last_name
                }
                pass = newInfos.password;
            }else{
                setErrInput(true);
                setErrMessage("Nom ou prénom invalide");
            }
            setNewInfos({});
        }else if(e.target.name === "form-modif-mdp"){
            if(newMdp.new_password === newMdp.new_password_conf){
                dataSent = {
                    ...dataSent,
                    password: newMdp.new_password
                };
                pass = newMdp.password;
                nouvpass = newMdp.new_password_conf;
            }
            setNewMdp({});
        }else if(e.target.name === "form-modif-mail"){
            dataSent = {
                ...dataSent,
                email: newEmail.email
            };
            pass = newEmail.password;
            nouvmail = newEmail.email;
            setNewEmail({});
        }

        let fetchT = await fetchToken(infosUser.email, pass);
        if(pass){
            if(userToken === fetchT){
                resUp = await updateInfoPerso(dataSent);
                if(resUp.status === 200){
                    setErrInput(false);
                    // console.log("nouvpass", nouvpass);
                    // console.log("nouvmail", nouvmail);
                    if(nouvmail){
                        fetchT = await fetchToken(nouvmail, pass);
                    }
                    if(nouvpass){
                        fetchT = await fetchToken(infosUser.email, nouvpass);
                    }
                    // console.log("userToken", userToken);
                    // console.log("fetchT", fetchT);
                    setUserToken(fetchT);
                }else{
                    setErrInput(true);
                    setErrMessage(resUp.data.message);
                }
            }else{
                setErrInput(true);
                setErrMessage("Mot de passe invalide");
            }
        }
        // console.log("dataSent", dataSent);
        // console.log("resUp", resUp);
        fetchUserInfos();
        clearForm(e.target);
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
            <div className="inputs_divs">
                <form  onSubmit={ handlleSubmit } name="form-modif-infos">
                    <div className="input-div">
                        <p className="p-form-title">Changer mes informations</p>
                        <div><TextField
                            id="first_name"
                            label="Prénom"
                            type="text"
                            name="first_name"
                            defaultValue={infosUser.first_name}
                            onChange={ handleChangeInfos }
                        /></div>
                        <div><TextField
                            id="last_name"
                            label="Nom"
                            type="text"
                            name="last_name"
                            defaultValue={infosUser.last_name}
                            onChange={ handleChangeInfos }
                        /></div>
                        <div><TextField
                            required
                            id="password"
                            label="mot de passe"
                            type="password"
                            name="password"
                            onPaste={ noPaste }
                            onChange={ handleChangeInfos }
                        /></div>
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
                        <p className="p-form-title">Changer mon mot de passe</p>
                        <div><TextField
                            required
                            id="password"
                            label="mot de passe"
                            type="password"
                            name="password"
                            onPaste={ noPaste }
                            onChange={ handleChangeMdp }
                        /></div>
                        <div><TextField
                            required
                            id="new_password"
                            label="nouveau mot de passe"
                            type="password"
                            name="new_password"
                            onPaste={ noPaste }
                            onChange={ handleChangeMdp }
                        /></div>
                        <div><TextField
                            required
                            id="new_password_conf"
                            label="confirmation nouveau mot de passe"
                            type="password"
                            name="new_password_conf"
                            onPaste={ noPaste }
                            onChange={ handleChangeMdp }
                        /></div>
                        <Button 
                            className="submit_button"
                            variant="contained" 
                            color="primary" 
                            type="submit"
                        >modifier mon mot de passe</Button>
                    </div>
                </form>
                <form onSubmit={ handlleSubmit } name="form-modif-mail">
                    <div className="input-div">
                        <p className="p-form-title">Changer mon email</p>
                        <div><TextField
                            required
                            id="email"
                            label="nouvel email"
                            type="text"
                            name="email"
                            onChange={ handleChangeEmail }
                        /></div>
                        <div><TextField
                            required
                            id="password"
                            label="mot de passe"
                            type="password"
                            name="password"
                            onPaste={ noPaste }
                            onChange={ handleChangeEmail }
                        /></div>
                        <Button 
                            className="submit_button"
                            variant="contained" 
                            color="primary" 
                            type="submit"
                        >modifier mon email</Button>
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