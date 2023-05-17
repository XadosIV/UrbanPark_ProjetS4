import { IconButton } from '@mui/material';
import { Notifications, NotificationsNone } from '@mui/icons-material';
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import '../css/notif_bell.css';
import { NotificationList} from "."

export function NotifBell(props){
    const [active, setActive] = useState(true);

    return (
        <Popup
            trigger={<IconButton disableRipple onClick={() => setActive(!active)}>
                { active ? <Notifications sx={{ fontSize:"4rem" }} /> : <NotificationsNone sx={{ fontSize:"4rem" }} /> }
            </IconButton>}
            position='bottom center'
        >
			<NotificationList id={props.userId} reBoot={active}/>
        </Popup>
    );
}