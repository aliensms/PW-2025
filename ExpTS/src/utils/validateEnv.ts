import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str({choices: ["prodution", "development"], default: "development"}),
        PORT: port(),
        DATABASE_URL: str(),
        LOGS_PATH: str(),
        SECRET_SESSION: str(),
    });
};

export default validateEnv;