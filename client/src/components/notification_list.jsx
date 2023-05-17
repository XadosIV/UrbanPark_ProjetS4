import React, { useState } from 'react';
import { Notification } from "."
import { GetNotificationId } from '../services';

export function NotificationList () {
	GetNotificationId(4)
	const test = {
		type:"Réunion",
		users:["Matrac Henry", "Pavlof Gérard", "Tam Tom"],
		horaire: [new Date('August 19, 1975 13:15:30'), new Date('August 19, 1975 15:00:00')]
	}
	const testo = {
		type:"Nettoyage",
		users:["Matrac Henry", "Pavlof Gérard", "Pourkaf Pierrick"],
		parking:"Halles",
		etages:[
			{
				numero:1,
				places:["H1-203", "H1-204", "H1-205"],
			},
			{
				numero:2,
				places:["H2-203", "H2-204", "H2-205"],
			},
		]
		,
		horaire: [new Date('August 19, 1975 13:15:30'), new Date('August 19, 1975 15:00:00')]
	}
	const testi = {
		type:"Gardiennage",
		users:["Ferdinant François", "Travolta Jean", "Casting Charles"],
		parking:"Lac",
		horaire: [new Date('August 19, 1975 13:15:30'), new Date('August 19, 1975 15:00:00')]
	}
	return (
		<div>
			<h3>
				Liste des notifications
			</h3>
			<ul>
				<li>
					<Notification index={1} info={test}/>
				</li>
				<li>
					<Notification index={3} info={testi}/>
				</li>
				<li>
					<Notification index={2} info={testo}/>
				</li>
			</ul>
		</div>
	)
}