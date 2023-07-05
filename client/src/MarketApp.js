import { useReducer, useEffect } from "react"

import { HashRouter } from "react-router-dom"
import { AuthContext } from "./auth/AuthContext"
import { AppRoute } from "./routes"
import { authReducer } from "./auth/authReduces"
import { AuthProvider } from "./auth/AuthProvider"



export const MarketApp = () => {
    return (
        <HashRouter>
            <AuthProvider>
                <AppRoute />
            </AuthProvider>
        </HashRouter>
    )
}