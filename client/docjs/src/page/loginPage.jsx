import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import React, { useState } from 'react';

const LoginPage = () => {

	const [credentials, setCredentials] = useState({
		identifier: "",
		password: ""
	})

	const handleChange = ({currentTarget}) =>{
		const {value, name} = currentTarget
		setCredentials({
			...credentials, 
			[name]: value
		})
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		
	}

	return (
		<form>
			<div>
				<TextField
				id = "identifier"
				label = "Username"
				type="text"
				name = "identifier"
				onChange={handleChange}
				/>
			</div>
			<div>
				<TextField
				id = "password"
				label = "Password"
				type="text"
				name = "password"
				onChange={handleChange}
				/>
			</div>
			<div>
				<Button variant="contained" type = "submit" color='primary'>
					Login
				</Button>
			</div>
		</form>
	);
};

export default LoginPage;