import { QueryResult } from "pg";

export interface IDeveloper {
  id: number;
  name: string;
  email: string;
}

export type TDeveloperCreate = Omit<IDeveloper, "id">;
export type TDeveloperResult = QueryResult<IDeveloper>;

export interface IDeveloperInfos {
  id: number;
  developerSince: Date;
  preferredOS: string;
  developerId: number;
}

export type TDeveloperInfosCreate = Omit<IDeveloperInfos, "id">;
export type TDeveloperInfosResult = QueryResult<IDeveloperInfos>;

export interface IDeveloperComplete {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
}

export interface IProject {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date;
  developerId: number;
}

export interface ITechnology {
  id: number;
  name: string;
}

export interface IProject_technology {
  id: number;
  addedIn: Date;
  technologyId: number;
  projectId: number;
}
