import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export function HomeButton(){
    const navigate = useNavigate();

    const retour = () => {
        navigate("/");
    }

    return(<div className="home-button">
        <Button
        variant="contained"
        color="primary"
        onClick={ retour }
        >accueil</Button>
    </div>)
}
