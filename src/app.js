import express from "express"
import path from "path"
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine" , "ejs");
app.set("views" , path.resolve("./src/views"));

import mainRouter from "./routes/main.router.js"
app.use("/",mainRouter);

console.log(process.env.PORT);
export {app}
