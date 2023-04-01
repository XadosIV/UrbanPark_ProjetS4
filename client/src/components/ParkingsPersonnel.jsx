import React from "react";
import { ParkingList } from "./ParkingList";

export function ParkingsPersonnel() {

	const listParkings = [
		{
			"nom": "parking1",
			"nbPlaceLibre": 29,
			"nbPlaceTot": 59,
            "etages":2,
            "address": "4 rue des fleurs 73000 Chambéry",
		},
		{
			"nom": "parking2",
			"nbPlaceLibre": 18,
			"nbPlaceTot": 89,
            "etages":1,
            "address": "7 rue des champignons 73470 Novalaise",
		}
	];

	return (<div>
            <div className="title-parkings">
                <h1>Tous les parkings</h1>
            </div>
			{
				listParkings.map((parking, index) => (
					<ParkingList key={index} parking={parking}/>
				))
			}
		</div>)
}