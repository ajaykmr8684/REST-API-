import express from "express";
import { APP_PORT } from "./config";
const app = express();
import routes from "./routes"

app.use(express.json());
app.use("/api", routes);










//Listener
app.listen(APP_PORT, () => console.log(`App is listening on port ${APP_PORT}.`))