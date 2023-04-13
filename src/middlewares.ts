import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
  IDeveloper,
  TDeveloperCreate,
  TDeveloperResult,
  TTechnologyResult,
} from "./interfaces";
import { client } from "./database";

export const verifyIfEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const developerData: TDeveloperCreate = req.body;
  const email: string = developerData.email;
  const queryString: string = `
        SELECT *
        FROM developers
        WHERE email = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return res.status(409).json({
      message: "Email already exists.",
    });
  }

  return next();
};

export const verifyIfIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);
  let queryString: string = `
        SELECT *
        FROM developers
        WHERE id = $1;
    `;

  let queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found.",
    });
  }

  res.locals.id = id;
  res.locals.developer = queryResult.rows[0];

  return next();
};

// export const verifyIfIdExists = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response | void> => {
//   const id: number = parseInt(req.params.id);
//   let queryString: string = `
//         SELECT *
//         FROM developers
//         WHERE id = $1;
//     `;

//   let queryConfig: QueryConfig = {
//     text: queryString,
//     values: [id],
//   };

//   const queryResult: TDeveloperResult = await client.query(queryConfig);

//   if (queryResult.rowCount === 0) {
//     return res.status(404).json({
//       message: "Developer not found.",
//     });
//   }

//   res.locals.id = id;
//   res.locals.developer = queryResult.rows[0];

//   return next();
// };

export const verifyIfDeveloperInfosExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id); // talvez pegar do res.locals.id ?
  const queryString: string = `
        SELECT *
        FROM developer_infos
        WHERE "developerId" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return res.status(409).json({
      message: "Developer infos already exists.",
    });
  }

  return next();
};

export const verifyIfPreferredOSExists = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const preferredOS: string = req.body.preferredOS;

  if (
    preferredOS === "Windows" ||
    preferredOS === "Linux" ||
    preferredOS === "MacOS"
  ) {
    return next();
  }

  return res.status(400).json({
    message: "Invalid OS option.",
    options: ["Windows", "Linux", "MacOS"],
  });
};

// export const verifyIfDeveloperIdExists = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response | void> => {
//   const id: number = parseInt(req.params.id);
//   const queryString: string = `
//         SELECT *
//         FROM developer
//         WHERE developerId = $1;
//     `;

//   const queryConfig: QueryConfig = {
//     text: queryString,
//     values: [id],
//   };

//   const queryResult: TDeveloperResult = await client.query(queryConfig);

//   if (queryResult.rowCount === 0) {
//     return res.status(404).json({
//       message: "Developer not found.",
//     });
//   }

//   res.locals.id = id;
//   res.locals.developer = queryResult.rows[0];

//   return next();
// };

export const verifyIfDeveloperIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const developerId: number = req.body.developerId;

  const queryString: string = `
        SELECT *
        FROM developers
        WHERE id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found.",
    });
  }

  res.locals.id = developerId;
  res.locals.developer = queryResult.rows[0];

  return next();
};

export const verifyIfProjectIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId: number = parseInt(req.params.id);
  let queryString: string = `
        SELECT *
        FROM projects
        WHERE id = $1;
    `;

  let queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  res.locals.projectId = projectId;

  return next();
};

export const verifyIfTechExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId: number = res.locals.projectId;
  const techName: string = req.body.name || req.params.name;

  const queryString: string = `
    SELECT
      techs."id"
    FROM
      technologies techs
    WHERE
      techs."name" = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [techName],
  };

  const queryResult: TTechnologyResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.techId = queryResult.rows[0].id;

  return next();
};

// export const verifyIfTechExists = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response | void> => {
//   const projectId: number = res.locals.projectId;
//   const techName: string = req.body.name;

//   const queryString: string = `
//     SELECT
//       *
//     FROM
//       technologies
//     WHERE
//       technologies."name" = $1
//   `;

//   const queryConfig: QueryConfig = {
//     text: queryString,
//     values: [techName],
//   };

//   const queryResult: TDeveloperResult = await client.query(queryConfig);

//   if (queryResult.rowCount === 0) {
//     return res.status(400).json({
//       message: "Technology not supported.",
//       options: [
//         "JavaScript",
//         "Python",
//         "React",
//         "Express.js",
//         "HTML",
//         "CSS",
//         "Django",
//         "PostgreSQL",
//         "MongoDB",
//       ],
//     });
//   }

//   return next();
// };

export const verifyIfTechAlreadyAdded = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId: number = res.locals.projectId;
  const techName: string = req.body.name;
  const techId: number = res.locals.techId;

  const queryString: string = `
    SELECT
      *
    FROM
      projects_technologies ptechs
    JOIN
      projects p ON p."id" = ptechs."projectId"
    WHERE
      ptechs."technologyId" = $1 AND p."id" = $2
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [techId, projectId],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    if (
      req.method === "DELETE" &&
      req.route.path === "/projects/:id/technologies/:name"
    ) {
      return next();
    }

    return res.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  if (
    req.method === "DELETE" &&
    req.route.path === "/projects/:id/technologies/:name"
  ) {
    return res.status(400).json({
      message: "Technology not related to the project.",
    });
  }

  return next();
};
