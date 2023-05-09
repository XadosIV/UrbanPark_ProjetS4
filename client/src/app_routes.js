import { Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "./components";
import { useIsConnected, useIsGerantOuGardien } from "./interface";
import { NotFoundPage, Authentication, Connection, HomePage, Registration, Parkings, PersonalPage } from "./page"

export function AppRoutes() {
	const isConnected = useIsConnected();
	const isGerantGardien = useIsGerantOuGardien();

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route element={ <ProtectedRoutes isAllowed={ isConnected() } to="/authentication" /> } >
				<Route path="/perso" element={ <PersonalPage /> } />
			</Route>
			<Route element={ <ProtectedRoutes isAllowed={ isGerantGardien() } to="/authentication" /> } >
				<Route path="/parkings/:parking" element={<Parkings/>} />
			</Route>
			<Route element={ <ProtectedRoutes isAllowed={ !(isConnected()) } to="/" /> }>
				<Route path="/authentication" element={<Authentication />} />
				<Route path="/connection" element={<Connection />} />
				<Route path="/registration" element={<Registration />} />
			</Route>
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

