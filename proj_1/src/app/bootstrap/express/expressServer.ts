import express, { response, Router } from 'express';
import cors from 'cors';
import { Express, Response, Request } from "express";
import path from 'node:path';
import { handleExpressError } from '../exceptions/handleExpressError';

export function expressServer(app: Express, PORT: number) {
    const router = Router()

    app.use(cors({
        origin: process.env.FRONT_APP_URL,
        credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('assets', express.static(path.join(process.cwd(), 'public')));
    app.use(handleExpressError)

    app.get('/', async (req: Request, res = response) => {
        res.json({ message: "server is up" })
    });

    app.listen(PORT, () => {
        console.log(`Express server is runing at http://localhost:${PORT}`)
    });


}