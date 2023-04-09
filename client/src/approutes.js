import React from "react"
import { Route, Routes } from "react-router-dom"
import { Test, NotFoundPage, Connexion, HomePage, ListePlanningsGardiens, AdminPage } from "./page"

export function AppRoutes() {

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/test" element={<Test />} />
      		<Route path="/admin" element={<AdminPage />} />
			<Route path="/listePlanningGardiens" element={<ListePlanningsGardiens />} />
			<Route path="/connexion" element={<Connexion />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

