import { NextFunction, Request, Response } from "express";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.logado){
        next()
    } else res.redirect("/users/login")
}