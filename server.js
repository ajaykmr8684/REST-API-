import express from "express";
import { APP_PORT, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
const app = express();
import routes from "./routes"
import mongoose from "mongoose"
import path from "path"

mongoose.connect(DB_URL)
.then(() => {
    console.log("Database Connected.")
})
.catch((e) => {
    console.log(`Oops, Mongo died. Issue: ${e}`)
})

global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler)










//Listener
app.listen(APP_PORT, () => console.log(`App is listening on port ${APP_PORT}.`))