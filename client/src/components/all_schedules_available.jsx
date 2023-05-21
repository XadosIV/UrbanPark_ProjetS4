import React from "react";
import { ChangeDate } from "../interface"
import 'react-datepicker/dist/react-datepicker.css'
import "../css/parking.css"

export function AllSchedulesAvailable(props) {

    function PassToBig() {
        props.handleCallback({update:true, schedule:props.schedule})
    }

    return (<div key={props.key} className="all-schedules" onClick={PassToBig}>Du {ChangeDate(props.schedule[0].slice(0,10))} à {props.schedule[0].slice(11,19)}  au  {ChangeDate(props.schedule[1].slice(0,10))} à {props.schedule[1].slice(11,19)}</div>
    );
}