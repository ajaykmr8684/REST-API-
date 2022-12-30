import express from "express";
import { APP_PORT } from "./config";
import errorHandler from "./middlewares/errorHandler";
const app = express();
import routes from "./routes"

app.use(express.json());
app.use("/api", routes);
app.use(errorHandler)










//Listener
app.listen(APP_PORT, () => console.log(`App is listening on port ${APP_PORT}.`))