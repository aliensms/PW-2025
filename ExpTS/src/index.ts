import express from "express";
import dotenv from "dotenv";
import {v4 as uuidv4} from "uuid";
import session from "express-session";
import flash from "connect-flash";

import { engine } from "express-handlebars";

import validateEnv from "./utils/validateEnv";
import logger from "./middlewares/logger";
import router from "./router/router";
import cookieParser from "cookie-parser"
import { checkAuth } from "./middlewares/checkAuth";
import { getUser } from "./services/user";
import path from "path";

declare module "express-session" {
    export interface SessionData {
        logado: boolean
        userId?: string;
    }
}


const app = express();
dotenv.config();
validateEnv();

const PORT = process.env.PORT ?? 6688;



app.engine("handlebars", engine({
    helpers: require(`${__dirname}/views/helpers/helpers.ts`)
}));
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(logger("simple"));

app.use("/css", express.static(`${process.cwd()}/public/css/`));
app.use("/js", express.static(`${process.cwd()}/public/js/`));
app.use("/img", express.static(`${process.cwd()}/public/img/`));

app.use("/game/css", express.static(`${process.cwd()}/public/game/pw-game/css/`));
app.use("/game/js", express.static(`${process.cwd()}/public/game/pw-game/js/`));
app.use("/game/assets", express.static(`${process.cwd()}/public/game/pw-game/assets/`));



app.use(express.urlencoded({extended:false}));
app.use(express.json()); // <-- Adicione esta linha para a API do jogo
app.use(cookieParser())
app.use(session({
    genid: ()=> uuidv4(),
    secret: process.env.SECRET_SESSION !,
    resave: true,
    cookie: {},
    saveUninitialized: true,
}))
app.use(flash());

// Middleware para expor dados da sessão para as views (Handlebars)
app.use(async (req, res, next) => {
    res.locals.logado = req.session.logado || false;
    res.locals.userId = req.session.userId || null;

    
    if (req.session.userId) {
        try {
            res.locals.user = await getUser(req.session.userId);
        } catch (err) {
            console.error(err);
            res.locals.user = null;
        }
    }

    next();
});

app.use(router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});