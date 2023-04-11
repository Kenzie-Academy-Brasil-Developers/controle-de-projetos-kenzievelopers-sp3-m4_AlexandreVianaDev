import express, { Application } from "express";
import "dotenv/config";
import { getDeveloperById, insertDeveloper } from "./logics";
import { verifyIfEmailExists, verifyIfIdExists } from "./middlewares";

const app: Application = express();

app.use(express.json());

app.post("/developers", verifyIfEmailExists, insertDeveloper);
app.get("/developers/:id", verifyIfIdExists, getDeveloperById);
app.patch("/developers/:id");
app.delete("/developers/:id");
app.post("/developers/:id/infos");

export default app;
