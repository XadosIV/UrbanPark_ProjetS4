import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { NewScheduleForm } from "../components"
import TP from "../services/take_parking";
import TBR from "../services/take_by_role";


export function ButtonAddSchedules() {
    /**
         * AllParkings
         * Returns a lists of options for a Select React component composed of every type 
         *
         * @param { Array } list - List of parkings
         * @return { Array }
         */
    function AllParkings(list) {
        var opt = []
        for (let i=0; i<list.length; i++) {
            opt.push({value:list[i].name.toString(), label:"Parking " + list[i].name.toLowerCase()})
        }
        return opt
    }

    /**
     * AllServices
     * Returns a lists of options for a Select React component composed of every type 
     *
     * @param { Array } list - List of service
     * @return { Array }
     */
    function AllServices(list) {
        var opt = []
        for (let i=0; i<list.length; i++) {
            opt.push({value:list[i].id, label:list[i].first_name + " " + list[i].last_name})
        }
        return opt
    }

    const [parkingsList, setParkingsList] = useState([]);

    const [serviceList, setServiceList] = useState([]);

    var optionsParking = AllParkings(parkingsList)
    var optionsService = AllServices(serviceList)

    useEffect(() => {
        TP.TakeParking().then(res => setParkingsList(res));
        TBR.TakeByRole("Agent d'entretien").then(res => setServiceList(res))
    })

    return (
        <NewScheduleForm options={{parking:optionsParking, service:optionsService}}/>
    )
}