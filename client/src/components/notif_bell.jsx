import { IconButton } from '@mui/material';
import { Notifications, NotificationsNone } from '@mui/icons-material';
import React from 'react';
import Popup from 'reactjs-popup';
import '../css/notif_bell.css';

export function NotifBell(){
    const active = true;

    return (
        <Popup
            trigger={<IconButton>
                { active ? <Notifications sx={{ width: '20%', height: '20%' }} /> : <NotificationsNone sx={{ width: '20%', height: '20%' }} /> }
            </IconButton>}
            position='bottom center'
        >
        </Popup>
    );
}