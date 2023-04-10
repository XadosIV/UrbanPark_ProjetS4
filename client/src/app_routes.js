import React from "react"
import { Route, Routes } from "react-router-dom"
import { Test, NotFoundPage, Authentication, Connexion, HomePage, GuardiansListSchedule, AdminPage, Registration } from "./page"

export function AppRoutes() {

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/test" element={<Test />} />
			<Route path="/authentification" element={<Authentication />} />
			<Route path="/admin" element={<AdminPage />} />
			<Route path="/guardiansListSchedule" element={<GuardiansListSchedule />} />
			<Route path="/connexion" element={<Connexion />} />
			<Route path="/inscription" element={<Registration />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

