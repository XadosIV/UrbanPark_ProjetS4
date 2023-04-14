import React from "react";
import { Button } from "@mui/material";

export function AssignToSub() {
    return <Button variant="contained" color="primary" 
    style={{
        backgroundColor: "#FE434C",
        borderColor: "transparent",
        borderRadius: 20,
        width: 160,
        float:"right",
        height:"10%",
        marginBottom:"5px"
    }}>Assigner cette place à un abonné</Button>
}