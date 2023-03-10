import { AccessibilityNew } from "@mui/icons-material"
import { Box, Stack, Typography,Button } from "@mui/material"
import { AppRoutes } from "./AppRoutes"
import { Link } from "react-router-dom";
import React from "react";
export function App() {
    
    return (
        <Box
            sx={{ padding: 2 }}
        >
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}

                sx={{
                    marginBottom: 2,
                }}
            >
              

                <AccessibilityNew fontSize="large" />
                <Link to="/">
                    <Typography variant="h3">home</Typography>
                </Link>
                <AccessibilityNew fontSize="large" />
                <Link to="/test">
                      <Button variant="contained">go test</Button>
              </Link>
            </Stack>
            <AppRoutes />
        </Box>
    )

}


