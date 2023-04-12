import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export function GoBack(){
    const navigate = useNavigate();

    const retour = () => {
        navigate(-1);
    }

    return(<div className="go_back_button">
        <Button
        variant="contained"
        color="primary"
        onClick={ retour }
        >retour</Button>
    </div>)
}
