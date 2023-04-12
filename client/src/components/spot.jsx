import React, { useState, useEffect } from "react";
import { SpotName } from "../interface"
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import TBS from "../services/take_by_spot"
import TAST from "../services/take_all_spot_types"

export function Spot(props) {

    const [user, setUser] = useState([]);

    useEffect(() => {
        TBS.TakeBySpot(props.spot.id).then(res => {setUser(res);});
    }, []);

    const [types, setTypes] = useState([]);

    useEffect(() => {
        TAST.TakeAllSpotTypes(props.spot.id).then(res => {setTypes(res);});
    }, []);

    var infosSpot;
    if (user.length == 1) {
        infosSpot = user.map((user) => (
            <Link to={`/users/${user.id}/profile`} style={{textDecoration:"none"}}>
                Place attribuée à : <br/> {user.first_name} {user.last_name}
            </Link>))
    } else {
        infosSpot = <p>Cette place n'a pas d'abonné attitré</p>
    }

    var typesSpot;
    if (types.length == 0) {
        typesSpot = <p>Place accessible à tout le monde</p>
    } else {
        typesSpot = types.map((type) => (
        <p>Place {type.name}<br/></p>))
    }

	return (<div className="spot">
        <div class="dropdown">
            <Button variant="contained" color="primary" className="dropbtn" style={{width:"200px"}}>
                Place {SpotName(props.spot)}
            </Button>
            <div class="dropdown-content">
                {infosSpot}
                {typesSpot}
            </div>
        </div>
    </div>)
}