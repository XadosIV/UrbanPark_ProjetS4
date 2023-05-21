import React, { useEffect, useState } from 'react';
import { Notification } from "."
import { GetDemandeAbo, getNotificationId } from '../services';

export function NotificationList (props) {
	const [listNotification, setListNotification] = useState([]);
	const [demandeAbo, setDemandeAbo] = useState([]);

	useEffect(() => {
		async function fetchNotification (id) {
			let notification = await getNotificationId(id);
			setListNotification(notification);
			let listDemandeAbo = await GetDemandeAbo();
			setDemandeAbo(listDemandeAbo);
		}

		fetchNotification(props.id);
	}, [props])
	
	return (
		<div className='notification-list'>
			<h3>
				Demande d'abonnements
			</h3>
			{ !!!demandeAbo.length &&
				<h5>Il y a des demandes d'abonnement à remplir</h5>
			}
			{
				!!demandeAbo.length &&
				<h5>Aucune demandes d'abonnements</h5>
			}
			<h3>
				Notifications
			</h3>
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