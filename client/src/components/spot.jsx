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
        infosSpot = <a id="no-hover">Cette place n'a pas d'abonné attitré</a>
    }

    var typesSpot;
    if (types.length == 0) {
        typesSpot = <li><p><strong>-</strong> Place accessible à tout le monde</p></li>
    } else {
        typesSpot = types.map((type) => (
            <p><strong>-</strong> Place {type.name}<br/></p>
        ))
    }

	return (<div className="spot">
        <div class="dp">
            <Button variant="contained" color="primary" className="dropbtn" style={{width:"200px"}}>
                Place {SpotName(props.spot)}
            </Button>
            <div class="dp-content">
                {infosSpot}
                {typesSpot}
                <Button variant="contained" color="primary" 
                style={{
                    backgroundColor: "#FE434C",
                    borderColor: "transparent",
                    borderRadius: 20,
                    width: 160,
                    float:"right",
                    height:"10%",
                }}>Ajouter un type à cette place</Button>
            </div>
        </div>
    </div>)
}