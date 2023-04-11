import format from "pg-format";
import {
  IDeveloper,
  IDeveloperInfos,
  TDeveloperCreate,
  TDeveloperInfosCreate,
  TDeveloperInfosResult,
  TDeveloperResult,
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
    JOIN 
      developer_infos devInfos ON devInfos."developerId" = dev."id"
    WHERE
      dev."id" = $1;
    `;

  // const queryString: string = `
  // SELECT
  //   dev."id" AS "developerId", dev."name" AS "developerName", dev."email" AS "developerEmail", devInfos."developerSince" AS "developerInfoDeveloperSince", devInfos."preferredOS" AS "developerInfoPreferredOS"
  // FROM
  //   developers dev
  // JOIN
  //   developer_infos devInfos ON devInfos."developerId" = dev."id"
  // JOIN
  //   projects p ON p."developerId" = dev."id"
  // WHERE
  //   dev."id" = $1;
  // `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
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
