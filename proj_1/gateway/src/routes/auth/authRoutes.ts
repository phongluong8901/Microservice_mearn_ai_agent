import { Router } from "express";
import { loginUsergRPC, registerUsergRPC, verifyUserEmailgRPC } from "../../app/bootstrap/grpc/gRPCAuthClient";

export function authRoutes(router: Router) {
    router.post('/register', registerUsergRPC)
    router.post('/verify-email', verifyUserEmailgRPC)
    router.post('/login', loginUsergRPC)

    return router
}