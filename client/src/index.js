import reportWebVitals from './reportWebVitals';
import React,{StrictMode} from 'react';
import './index.css';
import {App} from "./App";
import { BrowserRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client';



createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
					<App />
		</BrowserRouter>
	</StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
