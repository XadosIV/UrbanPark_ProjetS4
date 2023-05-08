import React, { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css'
import "../css/parking.css"

export function AllSchedulesAvailable(props) {

    function PassToBig() {
        props.handleCallback({update:true, schedule:props.schedule})
    }

    return (<div className="all-schedules" onClick={PassToBig}>Du {props.schedule[0].replace('T', ' ').slice(0,10)} à {props.schedule[0].replace('T', ' ').slice(11,19)}  au  {props.schedule[1].replace('T', ' ').slice(0,10)} à {props.schedule[1].replace('T', ' ').slice(11,19)}</div>
    );
}