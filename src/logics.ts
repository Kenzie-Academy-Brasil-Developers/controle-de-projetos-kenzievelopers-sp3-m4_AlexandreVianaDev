import format from "pg-format";
import { IDeveloper, TDeveloperCreate, TDeveloperResult } from "./interfaces";
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
            *
        FROM
            developers dev
        WHERE
            dev."id" = $1
        JOIN 
            developer_infos devInfos ON devInfos."developerId" = dev."id"
        JOIN
            projects p ON p."developerId" = dev."id";
    `;

  //     const queryString: string = `
  //     SELECT
  //         *
  //     FROM
  //         developers dev
  //     JOIN
  //         developer_infos devInfos ON devInfos."developerId" = dev."id"
  //     JOIN
  //         projects p ON p."developerId" = dev."id";
  // `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);
  const developer: IDeveloper = queryResult.rows[0];

  return res.status(200).json(developer);
};
