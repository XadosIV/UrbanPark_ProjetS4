import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export function ProtectedRoutes ({ isAllowed, to }) {
    return isAllowed ?  <Outlet /> : <Navigate to={ to } /> ;
}