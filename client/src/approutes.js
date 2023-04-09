import React from "react"
import { Route, Routes } from "react-router-dom"
import { Test, NotFoundPage, Authentification, Connexion, HomePage, ListePlanningsGardiens, AdminPage, Inscription } from "./page"

export function AppRoutes() {

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/test" element={<Test />} />
			<Route path="/authentification" element={<Authentification />} />
			<Route path="/admin" element={<AdminPage />} />
			<Route path="/listePlanningGardiens" element={<ListePlanningsGardiens />} />
			<Route path="/connexion" element={<Connexion />} />
			<Route path="/inscription" element={<Inscription />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

