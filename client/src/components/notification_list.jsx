import React, { useEffect, useState } from 'react';
import { Notification } from "."
import { GetDemandeAbo, getNotificationId } from '../services';
import { Separation } from "../components"
import { NeedS, useIsGerantOuGardien } from '../interface';

export function NotificationList (props) {
	const admin = useIsGerantOuGardien();
	const [listNotification, setListNotification] = useState([]);
	const [demandeAbo, setDemandeAbo] = useState([]);

	useEffect(() => {
		async function fetchNotification (id) {
			let notification = await getNotificationId(id);
			if (notification) {
				setListNotification(notification);
			}
			let listDemandeAbo = await GetDemandeAbo();
			if (listDemandeAbo) {
				setDemandeAbo(listDemandeAbo);
			}
		}

		fetchNotification(props.id);
	}, [props])
	
	return (
		<div className='notification-list'>
			{
				admin() &&
					<div>
						<Separation value="Demandes d'abonnement" color="red"/>
					</div>
			}
			{ admin() && demandeAbo.length !== 0 &&
				<h5>Il y a {demandeAbo.length} demande{NeedS(demandeAbo.length)} d'abonnement à remplir</h5>
			}
			{
				admin() && demandeAbo.length === 0 &&
				<h5>Aucune demande d'abonnement</h5>
			}
				<div>
					<Separation value="Notifications" color="red"/>
				</div>
			{ !!listNotification.length &&
				<ul>
					{
						listNotification.map((notif, index) => {
							return (
								<li  key={index} >
									<Notification info={notif}/>
								</li>
							)
						})
					}
				</ul>
			}
			{
				!!!listNotification.length &&
				<h5>Aucune notification</h5>
			}
		</div>
	)
}