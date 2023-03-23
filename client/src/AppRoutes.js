import React from "react"
import { Route, Routes } from "react-router-dom"
import { Test, NotFoundPage, Connexion, HomePage } from "./page"

export function AppRoutes() {

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/test" element={<Test />} />
			<Route path="/connexion" element={<Connexion />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}