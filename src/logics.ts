import format from "pg-format";
import {
  IDeveloper,
  IDeveloperInfos,
  IProject,
  ITechnology,
  TDeveloperCreate,
  TDeveloperInfosCreate,
  TDeveloperInfosResult,
  TDeveloperResult,
  TProjectCreate,
  TProjectResult,
  TTechnologyResult,
} from "./interfaces";
import { client } from "./database";
import { Request, Response } from "express";
import { QueryConfig } from "pg";

export const insertDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: TDeveloperCreate = req.body;
  const queryString: string = format(
    `
        INSERT INTO developers
            (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResult: TDeveloperResult = await client.query(queryString);
  const developer: IDeveloper = queryResult.rows[0];

  return res.status(201).json(developer);
};

export const getDeveloperById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = res.locals.id;
  const queryString: string = `
    SELECT
      dev."id" AS "developerId", dev."name" AS "developerName", dev."email" AS "developerEmail", devInfos."developerSince" AS "developerInfoDeveloperSince", devInfos."preferredOS" AS "developerInfoPreferredOS"
    FROM
      developers dev
    LEFT JOIN 
      developer_infos devInfos ON devInfos."developerId" = dev."id"
    WHERE
      dev."id" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);
  const developer: IDeveloper = queryResult.rows[0];

  console.log("RETORNO", developer);

  return res.status(200).json(developer);
};

export const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const developerData: Partial<TDeveloperCreate> = req.body;
  const id: number = res.locals.id;

  const queryString: string = format(
    `
      UPDATE developers
      SET (%I) = ROW(%L)
      WHERE id = $1
      RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

export const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = res.locals.id;
  const queryString: string = `
    DELETE FROM developers
    WHERE id = $1
    RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  return res.status(204).send();
};

export const insertDeveloperInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerInfosData: TDeveloperInfosCreate = req.body;
  const developerInfosDataWithId: TDeveloperInfosCreate = {
    ...developerInfosData,
    developerId: res.locals.id,
  };

  const queryString: string = format(
    `
        INSERT INTO developer_infos
            (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(developerInfosDataWithId),
    Object.values(developerInfosDataWithId)
  );

  const queryResult: TDeveloperInfosResult = await client.query(queryString);
  const developerInfos: IDeveloperInfos = queryResult.rows[0];

  return res.status(201).json(developerInfos);
};

export const insertProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let projectData: TProjectCreate = req.body;

  if (!projectData.endDate) {
    projectData.endDate = null;
  }

  const queryString: string = format(
    `
        INSERT INTO projects
            (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: TProjectResult = await client.query(queryString);
  const project: IProject = queryResult.rows[0];

  return res.status(201).json(project);
};

export const getProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // const projectId: number = parseInt(req.params.id);
  const projectId: number = res.locals.projectId;

  const queryString: string = `
  SELECT
    p."id" AS "projectId", p."name" AS "projectName", p."description" AS "projectDescription", p."estimatedTime" AS "projectEstimatedTime", p."repository" AS "projectRepository", p."startDate" AS "projectStartDate", p."endDate" AS "projectEndDate", p."developerId" AS "projectDeveloperId", ptechs."technologyId", techs."name" AS "technologyName"
  FROM
    projects p
  LEFT JOIN
    projects_technologies ptechs ON ptechs."projectId" = p."id"
  LEFT JOIN
    technologies techs ON techs."id" = ptechs."technologyId"
  WHERE
    p."id" = $1;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId],
  };

  const queryResult: TProjectResult = await client.query(queryConfig);
  // const project: IProject = queryResult.rows[0];

  return res.status(200).json(queryResult.rows);
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const projectData: Partial<TProjectCreate> = req.body;
  const projectId: number = res.locals.projectId;

  const queryString: string = format(
    `
      UPDATE projects
      SET (%I) = ROW(%L)
      WHERE id = $1
      RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId: number = res.locals.projectId;
  const queryString: string = `
    DELETE FROM projects
    WHERE id = $1
    RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  return res.status(204).send();
};

export const insertTechs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId: number = res.locals.projectId;
  const techId: number = res.locals.techId;

  const queryString: string = `
    INSERT INTO 
      projects_technologies
   ("addedIn", "technologyId", "projectId")
    VALUES
    ($1, $2, $3)
    RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [new Date(), techId, projectId],
  };

  const queryResult: TTechnologyResult = await client.query(queryConfig);
  const tech: ITechnology = queryResult.rows[0];

  const queryString2: string = `
  SELECT
    p."id" AS "projectId", p."name" AS "projectName", p."description" AS "projectDescription", p."estimatedTime" AS "projectEstimatedTime", p."repository" AS "projectRepository", p."startDate" AS "projectStartDate", p."endDate" AS "projectEndDate", ptechs."technologyId", techs."name" AS "technologyName"
  FROM
    projects p
  LEFT JOIN
    projects_technologies ptechs ON ptechs."projectId" = p."id"
  LEFT JOIN
    technologies techs ON techs."id" = ptechs."technologyId"
  WHERE
    p."id" = $1;`;

  const queryConfig2: QueryConfig = {
    text: queryString2,
    values: [projectId],
  };

  const queryResult2: TProjectResult = await client.query(queryConfig2);
  const project: IProject = queryResult2.rows[0];

  return res.status(201).json(project);
};

export const deleteTechs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId: number = res.locals.projectId;
  const techId: number = res.locals.techId;
  const queryString: string = `
    DELETE FROM 
      projects_technologies ptechs
    WHERE 
      ptechs."projectId" = $1 AND ptechs."technologyId" = $2
    RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId, techId],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  return res.status(204).send();
};
