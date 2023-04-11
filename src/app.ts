import express, { Application } from "express";
import "dotenv/config";
import {
  deleteDeveloper,
  getDeveloperById,
  insertDeveloper,
  insertDeveloperInfo,
  updateDeveloper,
} from "./logics";
import {
  verifyIfDeveloperInfosExists,
  verifyIfEmailExists,
  verifyIfIdExists,
  verifyIfPreferredOSExists,
} from "./middlewares";

const app: Application = express();

app.use(express.json());

app.post("/developers", verifyIfEmailExists, insertDeveloper);
app.get("/developers/:id", verifyIfIdExists, getDeveloperById);
app.patch(
  "/developers/:id",
  verifyIfIdExists,
  verifyIfEmailExists,
  updateDeveloper
);
app.delete("/developers/:id", verifyIfIdExists, deleteDeveloper);
app.post(
  "/developers/:id/infos",
  verifyIfIdExists,
  verifyIfDeveloperInfosExists,
  verifyIfPreferredOSExists,
  insertDeveloperInfo
);

export default app;
