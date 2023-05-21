import React from "react";
import "../css/notif_bell.css"

export function Notification(props) {
	function AffichagePlaces (places) {
		return (
			<div>
				De la place {places[0]} à la place {places[places.length-1]}
			</div>
		)
	}

	function AffichageEtages(etages) {
		return (
			<div>
				{
					
				}
			</div>
		)
	}

	function AffichageNettoyage(parking, etages){
		return (
			<div>
				<h4>
					Parking {parking}
				</h4>
				{

					AffichageEtages(etages)
				}
			</div>	
		)
	}

	function AffichageGardiennage(parking){
		return (
			<div>
				<h4>
					Parking {parking}
				</h4>
			</div>	
		)
	}

	function toLi(info) {
		const action = info.action
		const event = info.type;
		let users = info.users;
		let ajout, parking;
		let horaire = info.horaire

		if (!Array.isArray(users)){
			users = [users];
		}

		if (event === "Nettoyage") {
			parking = info.parking;
			let etages = info.etages;
			ajout = AffichageNettoyage(parking, etages);
		}
		else if (event === "Gardiennage") {
			parking = info.parking;

			ajout = AffichageGardiennage(parking);
		}

		return (
			<div>
				<h2>
					{action==="POST"? "Création": action==="PUT"? "Modification": "Supression"} {event==="Réunion"? "d'une": "d'un"} {event}
				</h2>
				<div>
					{(event==="Nettoyage" || event ==="Gardiennage") && ajout}
				</div>
				<p>Avec les employés suivants:</p>
				<ul>
					{
						users.map((user, index) => (
							<li key={index}>{user}</li>
						))
					}
				</ul>
				<p>Du {horaire[0].toLocaleDateString()} à {horaire[0].toLocaleTimeString()} au {horaire[1].toLocaleDateString()} à {horaire[1].toLocaleTimeString()}</p>
			</div>
		)
	}

	return (
		<div>
			{
				props.info && toLi(props.info)
			}
		</div>
	)
}