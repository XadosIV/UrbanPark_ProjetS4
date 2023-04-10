import React from "react";
import { Link } from "react-router-dom";

export function PlaceNumber(props) {
    return (<Link to={`/${props.user.id}/spot`} style={{textDecoration:"none"}}>Place n°{props.user.id_spot}</Link>)
}