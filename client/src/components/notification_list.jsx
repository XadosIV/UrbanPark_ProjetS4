import React, { useEffect, useState } from 'react';
import { Notification } from "."
import { getNotificationId } from '../services';

export function NotificationList (props) {
	const [listNotification, setListNotification] = useState([]);

	useEffect(() => {
		async function fetchNotification (id) {
			let res = await getNotificationId(id);
			setListNotification(res);
		}

		fetchNotification(props.id);
	}, [props])
	
	return (
		<div className='notification-list'>
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
				<h3>Aucune Notifications</h3>
			}
		</div>
	)
}