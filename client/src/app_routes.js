import React from "react";
import { Route, Routes } from "react-router-dom";
import { Test, NotFoundPage, Authentication, Connection, HomePage, GuardiansListSchedule, AdminPage, Registration, ParkingSpots } from "./page";
import { ProtectedRoutes } from "./components";
import { useIsConnected } from "./interface/";

export function AppRoutes() {
	const isConnected = useIsConnected();

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/test" element={<Test />} />
			<Route path="/admin" element={<AdminPage />} />
			<Route path="/parkings/:parking" element={<ParkingSpots />} />
			<Route path="/guardians-list-schedule" element={<GuardiansListSchedule />} />
			<Route element={ <ProtectedRoutes isAllowed={ isConnected } to="/" /> }>
				<Route path="/authentication" element={<Authentication />} />
				<Route path="/connection" element={<Connection />} />
				<Route path="/registration" element={<Registration />} />
			</Route>
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

