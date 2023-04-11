import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { IDeveloper, TDeveloperCreate, TDeveloperResult } from "./interfaces";
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

  const queryConfig: QueryConfig = {
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
