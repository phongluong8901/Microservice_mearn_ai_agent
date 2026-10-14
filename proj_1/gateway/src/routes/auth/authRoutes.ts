import { Router } from "express";
import { registerUser } from "../../app/bootstrap/grpc/gRPCAuthClient";

export function authRoutes(router: Router) {
    router.post('/register', registerUser)

    return router
}