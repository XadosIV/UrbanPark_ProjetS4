import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Goback(){
    const navigate = useNavigate();

    const retour = () => {
        navigate(-1);
    }

    return(<div>
        <Button
        variant="contained"
        color="primary"
        onClick={ retour }
        >retour</Button>
    </div>)
}
