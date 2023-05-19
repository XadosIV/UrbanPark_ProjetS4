import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import ReactModal from "react-modal";
import { creationCompte, TakeAllRoles } from "../services";
import { isValideNom } from "../interface";
import Select from 'react-select';

export function EmployeeRegistrationForm() {
	const [infos, setInfos] = useState({email: "", first_name: "", last_name: "", password: "", password_conf: "", id_role: ""});
	const [wrongInput, setWrongInput] = useState(false);
	const [errMessage, setErrMessage] = useState("");
	const [ role, setRole ] = useState([]);
	const [ optRole, setOptRole ] = useState([]);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		async function fetchRole(){
			let resRole = await TakeAllRoles();
			console.log("role", resRole);
			setRole(resRole);
		}
		fetchRole();
	}, [])

	useEffect(() => {
		console.log("roleOpt", role);
		if(role){
			let newOptRole = [];
			let newLabel = "";
			role.forEach(role => {
				newLabel = <div><p>{role.name}</p></div>;
				newOptRole.push({value: role.name, label: newLabel});
			});
			console.log("newOptRole", newOptRole);
			setOptRole(newOptRole);
		}
	}, [role])

	const handlleSubmit = async (event) => {
		event.preventDefault();
		console.log(infos);
		if(infos.password !== infos.password_conf){
			setWrongInput(true);
			setErrMessage("la confirmation du mot de passe est invalide");
		}else if(!isValideNom(infos.first_name) || !isValideNom(infos.last_name)){
			setWrongInput(true);
			setErrMessage("nom ou prénom invalide");
		}else{
			setWrongInput(false);
			const res = await creationCompte(infos);
			console.log(res);
			if(res.status === 200){
				setIsOpen(false);
			}else{
				setWrongInput(true);
				setErrMessage(res.data.message);
			}
		}
	}

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInfos(values => ({...values, [name]: value}))
    }

	const handleChangeSelect = (selectedOptions, nom) => {
		const name = nom.name;
		const value = selectedOptions.value;
		setInfos(values => ({...values, [name]: value}));
	}

	const noPaste = (e) => {
		e.preventDefault();
		return false;
	}

	const customStyles = (color) => ({
        overlay: {
            zIndex : 100000
        },
        content: {
            top: '17%',
            left: '50%',
            right: 'auto',
            bottom: '15%',
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection:"column",
            marginRight: '-50%',
            width: '25%',
            heigth: '75%',
            transform: 'translate(-40%, -10%)',
            border: color
        },
    });

	return(<div className="form_employee_div">
		<Button 
				className="open_button"
				variant="contained" 
				color="primary"
				onClick={() => {setIsOpen(true)}}
				style={{}}
			>Création de nouveaux employé</Button>
		<ReactModal ariaHideApp={false} isOpen={isOpen} contentLabel="EmployeeCreationForm" onRequestClose={() => {setIsOpen(false)}} style={customStyles('solid rgb(20, 94, 168)')}>
			<form onSubmit={handlleSubmit} className="form">
				<div className="inputs-divs">
					<div><TextField
						required
						id="last_name"
						label="Nom"
						type="text"
						name="last_name"
						onChange={handleChange}
					/></div>
					<div><TextField
						required
						id="first_name"
						label="Prénom"
						type="text"
						name="first_name"
						onChange={handleChange}
					/></div>
					<div><TextField
						required
						id="email"
						label="email"
						type="text"
						name="email"
						onChange={handleChange}
					/></div>
					<div><TextField
						required
						id="password"
						label="mot de passe"
						type="password"
						name="password"
						onChange={handleChange}
						onPaste={ noPaste }
					/></div>
					<div><TextField
						required
						id="password_conf"
						label="confirmation du mot de passe"
						type="password"
						name="password_conf"
						onChange={handleChange}
						onPaste={ noPaste }
					/></div>
					<div><Select 
						required
						name="id_role"
						className="select-role-user"
						placeholder="role demandé"
						options={ optRole }
						onChange={handleChangeSelect}
						maxMenuHeight={200}
					/></div>

				</div>
				<Button 
					className="submit_button"
					variant="contained" 
					color="primary" 
					type="submit"
				>inscription</Button>
			</form>
			{ wrongInput && <p className="err_message"> { errMessage } </p>}
		</ReactModal>
	</div>)
}
