import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { ContexteUser } from "../contexts/contexte_user";

export function ProtectedRoutes ({ roles, to }) {
    const { userRole } = useContext(ContexteUser);
    const ok = roles.includes(userRole);
    return ok ? <Outlet /> : <Navigate to={ to } /> ;
}