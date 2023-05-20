import React from "react";
import { useResetContext } from "../interface";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function DeconnexionButton() {
    const resetContext = useResetContext();
    const navigate = useNavigate();


    const reset = () => {
        resetContext();
        navigate("/");
    }

    return(<div>
        <Button 
            variant="contained"
            color="primary"
            className="deconnexion-button"
            onClick={ () => reset() }
        >
            Déconnexion
        </Button>
    </div>)
}

export { DeconnexionButton }