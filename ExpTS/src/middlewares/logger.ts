import { Request, Response, NextFunction } from "express";
import fsPromise from "fs/promises"

type LoggerType = "simple" | "complete";

function logger(type: LoggerType) {
    const LOGS_PATH = process.env.LOGS_PATH ?? "log";
    if (type === "simple" ) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const time = new Date()            
            await fsPromise.writeFile(
                `${process.cwd()}/${LOGS_PATH}/logs.log`,
                `Acesso em ${time.toISOString()} ${req.url} ${req.method}\n`,
                { flag: "a" }
            );    
            next();
        };
    } else {
        return (req: Request, res: Response, next: NextFunction) => {
            console.log("log completo")
            next();        
        };
    }
}
export default logger;