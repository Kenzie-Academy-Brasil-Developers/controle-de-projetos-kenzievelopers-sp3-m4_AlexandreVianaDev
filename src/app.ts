import express, { Application } from "express";
import "dotenv/config";

const app: Application = express();

app.post("/developers");
app.patch("/developers/:id");
app.delete("/developers/:id");
app.post("/developers/:id/infos");

export default app;
