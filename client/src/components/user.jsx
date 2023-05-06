import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import TAS from "../services/take_all_spots"
import { SpotName } from "../interface"

/**
 * Component of a User
 * @param { User } info
 * @return { Promise React.Component }
 */
export function User(props){

	async function hasPlace(spot) {
        var get = await TAS.TakeAllSpots(0, spot).then((res) => res)
        var result;
        if (get[0]) {
            result = SpotName(get[0])
        }
        return result
    }

	function Spots(spot, spotTemp) {
		if (spot.length != 0) {
			if (spotTemp.length != 0) {
				return <p style={{display: "inline"}}><br/>- Place {spot} <br/>- Place temporaire {spotTemp}</p>
			} else {
				return <p style={{display: "inline"}}><br/>- Place {spot}</p>
			}
		} else {
			return <p style={{display: "inline"}}><br/>- Pas de place attitrée</p>
		}
	}

    const [spotWithUser, setSpotWithUser] = useState([])
	const [spotTempWithUser, setSpotTempWithUser] = useState([])

	useEffect(() => {
		async function load() {
			await hasPlace(props.user.id_spot).then(res => {
				if (res) {
					setSpotWithUser(res)
				}
			})
			await hasPlace(props.user.id_spot_temp).then(res => {
				if (res) {
					setSpotTempWithUser(res)
				}
			})
		}
        load()
    }, [])

	return (
		<li key={props.index}>
			<div className="main-content">
				<div>
					<div>
						<h3>{props.user.first_name} {props.user.last_name} - {props.user.email}</h3>
						<p>{props.user.role} {Spots(spotWithUser, spotTempWithUser)} </p>
					</div>                       
				</div>
				<div>
					<Button variant="contained" color="primary">Changer la place de cet abonné</Button>
				</div>
			</div>           
		</li>
	)
}