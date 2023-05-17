import React from "react";


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
					etages.map((user, index) => (
						<div>
							<h4 key={index}>Etage {user.numero}</h4>
							{
								AffichagePlaces(user.places)
							}
						</div>
					))
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

	function AffichaeGardiennage(parking){
		return (
			<div>
				<h4>
					Parking {parking}
				</h4>
			</div>	
		)
	}

	function toLi(info) {
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

			ajout = AffichaeGardiennage(parking);
		}

		return (
			<div>
				<h2>
					{event}
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
			test {props.index}
			{
				props.info && toLi(props.info)
			}
		</div>
	)
}