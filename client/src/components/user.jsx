import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { TakeAllSpots, TakeParking, getAllSpotsFilter, SetSpotFromUser } from "../services"
import { SpotName, AllSpots } from "../interface"
import Select from 'react-select';
import ReactModal from 'react-modal';

/**
 * Component of a User
 * @param { User } info
 * @return { Promise React.Component }
 */
export function User(props){

	const userToken = "0000000000000000" //A faire marcher plus tard

	/**
     * BaseSpot
     * Returns a array corresponding to the base spot being passed in a react select defaultValue
     *
     * @param { integer } spot - id of the spot
     * @param { Array } list - List of options being passed in a react select
     * @return { Array }
     */
	function BaseSpotOpt(spot, list) {
		for (let s of list) {
			if (s.value === spot) {
				return s
			}
		}
		return ""
	}

	function spots(spot, spotTemp) {
		if (spot) {
			if (spot.length !== 0) {
				if (spotTemp) {
					if (spotTemp.length !== 0) {
						return <p style={{display: "inline"}}><br/>- Place {spot} <br/>- Place temporaire {spotTemp}</p>
					}
				} else {
					return <p style={{display: "inline"}}><br/>- Place {spot}</p>
				}
			} else {
				return <p style={{display: "inline"}}><br/>- Pas de place attitrée</p>
			}
		}
	}


    const [spotWithUser, setSpotWithUser] = useState([])
	const [spotTempWithUser, setSpotTempWithUser] = useState([])

	const [isOpen, setIsOpen] = useState(false)

	const delay = ms => new Promise(res => setTimeout(res, ms));

    const [ spot, setSpot ] = useState(props.user.id_spot);
	const [ park, setPark ] = useState({});
	const [ affErrMessage, setAffErrMessage ] = useState(false);
    const [ errMessage, setErrMessage ] = useState("");
	const [ optSpot, setOptSpot ] = useState([]);
	const [ update, setUpdate ] = useState(true);
	const [ allSpots, setAllSpots ] = useState([]);
	const [ fetchingSpot, setFetchingSpot ] = useState([]);
	const [ fetchingSpotTemp, setFetchingSpotTemp ] = useState([]);

	useEffect(() => {
		setAllSpots(props.allSpots);
	}, [update, props])

	useEffect(() => {
		async function fetchPark(parking_asked){
			let resPark = await TakeParking(parking_asked);
			setPark(resPark[0]);
		}
		fetchPark(props.user.id_park_demande);
	}, [props, update])

	useEffect(() => {
		async function fetchNewSpots() {
			let resGetSpot = allSpots.filter(spot => ((spot.id_park === props.user.id_park_demande) && (spot.types.includes("Abonné"))));
			// console.log("resGetSpot", props.user.id, resGetSpot);
			let newSpots = resGetSpot.filter(spot => (spot.id_user === null) && (spot.id_user_temp === null));
			setOptSpot(newSpots) 
		}
		fetchNewSpots()
	}, [props, allSpots, update])

	useEffect(() => {
		async function fetchBothSpot(){
			// console.log("res spot", props.user.id_park_demande, allSpots);
			let mainSpot = allSpots.find(spot => spot.id === props.user.id_spot);
			let tempSpot = allSpots.find(spot => spot.id === props.user.id_spot_temp);
			console.log("id user : ", props.user.id, "\nmain : ", mainSpot, "\ntemp : ", tempSpot, "\n");
			setSpotWithUser(SpotName(mainSpot));
			setSpotTempWithUser(SpotName(tempSpot));
		}
		fetchBothSpot();
	}, [props, allSpots, update])


/*
	useEffect(() => {
		async function fetchAllSpots(id_park, id, set){
			const data = await TakeAllSpots(id_park, id);
			set(data);
		}
		
		if (props.user.id_spot != null) {
			TakeAllSpots(props.user.id_park_demande, props.user.id_spot).then(res => {	
				if (res.length == 0) {
					TakeAllSpots(props.user.id_park_demande, props.user.id_spot).then(res => {
						setSpotWithUser(SpotName(res[0]))
					})
				} else {
					setSpotWithUser(SpotName(res[0]))
				}
			})
		}
		if (props.user.id_spot_temp != null) {
			TakeAllSpots(props.user.id_park_demande, props.user.id_spot_temp).then(res => {
				if (res.length == 0) {
					TakeAllSpots(props.user.id_park_demande, props.user.id_spot_temp).then(res => {
						setSpotTempWithUser(SpotName(res[0]))
					})
				} else {
					setSpotTempWithUser(SpotName(res[0]))
				}
			})
		}
		setUpdate(false)
    }, [props, update])*/

	useEffect(() => {
		const body = document.querySelector('body');
		body.style.overflow = isOpen ? 'hidden' : 'auto';
	}, [isOpen])

	const handleChangeSelect = (selectedOptions) => {
        setSpot(selectedOptions.value)
    }

	const handlleSubmit = async (e) => {
		e.preventDefault()
		async function SSFU(id_user, change) {
            await SetSpotFromUser(id_user, userToken, change)
        }
		if (spot != props.user.id_spot && spot != null) {
			SSFU(props.user.id, {id_spot:spot})
			setErrMessage("Modification prise en compte.")
			setAffErrMessage(true)
			props.handleCallback(true)
			await delay(2000);
			setUpdate(!update)
			setIsOpen(false)
		} else {
			setErrMessage("Vous n'avez pas modifié la place.")
			setAffErrMessage(true)
		}
	}

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
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection:"column",
            marginRight: '-50%',
            width: '25%',
			height: '50%',
            transform: 'translate(-40%, -10%)',
			border: 'solid rgb(20, 94, 168)'
        },
    };

	return (
		<li>
			<div className="main-content">
				<div>
					<div>
						<h3>{props.user.first_name} {props.user.last_name} - {props.user.email}</h3>

						<span>{spots(spotWithUser, spotTempWithUser, props.user.role)}</span>
					</div>                       
				</div>
				<div>
					<Button variant="contained" color="primary" onClick={() => {setIsOpen(true); setAffErrMessage(false)}}>Changer la place de cet abonné</Button>
					<ReactModal
                        ariaHideApp={false}
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        style={customStyles}
                    >              
                    <div>
                        <h3 style={{textAlign:"center"}}> Changement de la place de { props.user.first_name } { props.user.last_name } <br/> Dans le parking : { park.name } </h3>
                        { affErrMessage && <p className='err-message'> { errMessage } </p> }
						<form onSubmit={handlleSubmit}>
                        	<div style={{width: '40%', marginLeft: "auto", marginRight: "auto"}}>
                                <Select
                                    name="spot"
                                    className="select-attr-spot"
									defaultValue={BaseSpotOpt(props.user.id_spot, AllSpots(allSpots))}
                                    options= { AllSpots(optSpot) }
                                    onChange={handleChangeSelect}
									maxMenuHeight={200}
                                />
							</div>
							<div style={{width: '20%', marginLeft: "auto", marginRight: "auto", marginTop:"250px"}}>
								<Button
									className="submit_button" 
									variant="contained" 
									color="primary" 
									type="submit"
								>Valider</Button>
							</div>
						</form>
                    </div>
                    </ReactModal>
				</div>
			</div>           
		</li>
	)
}