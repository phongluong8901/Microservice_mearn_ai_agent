import { Router } from "express";
import { VerifyExpressToken } from "../../middleware/jwt";
import { getTaskgRPC } from "../../app/bootstrap/grpc/gRPCTaskClient";

export function taskRoutes(router: Router) {
    router.get('/tasks', VerifyExpressToken, getTaskgRPC)

    return router
}