import React from "react"
import { Route, Routes } from "react-router-dom"
import { Test, NotFoundPage, Essai } from "./page"
import { HomePage } from "./home"
import LoginPage from "./page/loginPage"

export function AppRoutes() {

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/test" element={<Test />} />
			<Route path="/essai" element={<Essai />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}