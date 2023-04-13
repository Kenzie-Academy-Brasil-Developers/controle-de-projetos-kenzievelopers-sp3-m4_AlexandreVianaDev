import express, { Application } from "express";
import "dotenv/config";
import {
  deleteDeveloper,
  deleteProject,
  deleteTechs,
  getDeveloperById,
  getProjectById,
  insertDeveloper,
  insertDeveloperInfo,
  insertProject,
  insertTechs,
  updateDeveloper,
  updateProject,
} from "./logics";
import {
  verifyIfDeveloperIdExists,
  verifyIfDeveloperInfosExists,
  verifyIfEmailExists,
  verifyIfIdExists,
  verifyIfPreferredOSExists,
  verifyIfProjectIdExists,
  verifyIfTechAlreadyAdded,
  verifyIfTechExists,
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

app.post("/projects", verifyIfDeveloperIdExists, insertProject);
app.get("/projects/:id", verifyIfProjectIdExists, getProjectById);
app.patch(
  "/projects/:id",
  verifyIfDeveloperIdExists,
  verifyIfProjectIdExists,
  updateProject
);
app.delete("/projects/:id", verifyIfProjectIdExists, deleteProject);
app.post(
  "/projects/:id/technologies",
  verifyIfProjectIdExists,
  verifyIfTechExists,
  verifyIfTechAlreadyAdded,
  insertTechs
);
app.delete(
  "/projects/:id/technologies/:name",
  verifyIfProjectIdExists,
  verifyIfTechExists,
  verifyIfTechAlreadyAdded,
  deleteTechs
);

export default app;
