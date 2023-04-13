import React from "react"
import { Route, Routes } from "react-router-dom"
import { Test, NotFoundPage, Authentication, Connection, HomePage, GuardiansListSchedule, AdminPage, Registration, Agenda } from "./page"

export function AppRoutes() {

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/test" element={<Test />} />
			<Route path="/authentication" element={<Authentication />} />
			<Route path="/admin" element={<AdminPage />} />
			<Route path="/guardians-list-schedule" element={<GuardiansListSchedule />} />
			<Route path="/connection" element={<Connection />} />
			<Route path="/registration" element={<Registration />} />
			<Route path="/agenda" element={<Agenda />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

