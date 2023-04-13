import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "./components";
import { useIsConnected } from "./interface";
import { Test, NotFoundPage, Authentication, Connection, HomePage, GuardiansListSchedule, AdminPage, Registration, ParkingSpots, Agenda } from "./page"

export function AppRoutes() {
	const isConnected = useIsConnected();

	useEffect(() => {
		console.log("hop");
	})

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/test" element={<Test />} />
			<Route path="/admin" element={<AdminPage />} />
			<Route path="/parkings/:parking" element={<ParkingSpots />} />
			<Route path="/guardians-list-schedule" element={<GuardiansListSchedule />} />
			<Route element={ <ProtectedRoutes isAllowed={ isConnected() } to="/" /> }>
				<Route path="/authentication" element={<Authentication />} />
				<Route path="/connection" element={<Connection />} />
				<Route path="/registration" element={<Registration />} />
			</Route>
			<Route path="/agenda" element={<Agenda />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

