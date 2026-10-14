import { Router, Express } from "express";
import { authRoutes } from "./auth/authRoutes";

export function apiV1(app: Express, router: Router) {
    const auth = authRoutes(router)

    app.use('/api/v1', auth)
}