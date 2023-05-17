import React, { useEffect, useState } from "react";
import { Spot } from "./"
import { GetSpotsFromFilter } from "../interface";

export function SpotsList(props) {		
	function Callback(childData) {
		props.handleCallback(childData)
	}

	function toggleSpotArr(spotData){
		props.checkBoxCallback(spotData)
	}

	function isChecked(idSpot){
		return props.toCheck(idSpot);
	}

	const filteredData = GetSpotsFromFilter(props.list, props.infos)

	const generateKey = (index, spot) => {
		let id = ""+ index + spot.floor + spot.number;
		return id;
	}

	let rendu = () => {
		return (
			filteredData.map((spot, index) => (
			<Spot spot={spot} key={generateKey(index, spot)} handleCallback={Callback} checkBoxCallback={toggleSpotArr} toCheck={isChecked} up={props.up}/>
		)))
	}

	useEffect(() => {setTest(rendu())}, [props])

	const [test, setTest] = useState(rendu())


	return (
	<div className="all-spots">
			{
				test
			}
		</div>)
}