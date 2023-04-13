import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export function ProtectedRoutes ({ isAllowed, to }) {
    return isAllowed ? <Navigate to={ to } /> : <Outlet /> ;
}