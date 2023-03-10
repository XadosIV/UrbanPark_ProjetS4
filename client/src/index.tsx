import React,{StrictMode} from 'react';
import './index.css';
import {App} from "./App";
import { BrowserRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client';



createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <BrowserRouter>
                    <App />
        </BrowserRouter>
    </StrictMode>
)
