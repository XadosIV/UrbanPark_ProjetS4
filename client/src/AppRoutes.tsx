import React from "react"
import { Route, Routes } from "react-router-dom"
import { Test,NotFoundPage } from "./page"
import { HomePage } from "./home"

export function AppRoutes() {

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
    }