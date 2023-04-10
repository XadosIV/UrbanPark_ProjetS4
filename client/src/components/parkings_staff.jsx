import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ParkingList } from "./parking_list";
import { Button } from "@mui/material";

export function ParkingsStaff() {

	const [parkingsList, setParkingsList] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:3001/api/parkings").then((res) => 
			setParkingsList(res.data)
		)}, []);

	return (<div>
            <div className="title-parkings">
                <h1>Les parkings</h1>
            </div>
			<div className="parking-list">
				{
					parkingsList.map((parking, index) => (
						<ParkingList key={index} parking={parking}/>
					))
				}
			</div>
			<Button variant="contained" color="primary" 
			style={{
				backgroundColor: "#FE434C",
				borderColor: "transparent",
				borderRadius: 20,
				width: 250,
				float:"right",
				height:"120%"
			}}>Ajouter un parking</Button>	
		</div>)
}
