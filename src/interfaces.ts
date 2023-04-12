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

// export interface IDeveloperComplete {
//   developerId: number;
//   developerName: string;
//   developerEmail: string;
//   developerInfoDeveloperSince: Date | null;
//   developerInfoPreferredOS: string | null;
// }

export interface IProject {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
}

export type TProjectCreate = Omit<IProject, "id">;
export type TProjectResult = QueryResult<IProject>;

// export interface IProjectComplete {
//   projectId: number;
//   projectName: string;
//   projectDescription: string;
//   projectEstimatedTime: string;
//   projectRepository: string;
//   projectStartDate: Date;
//   projectEndDate: Date | null;
//   projectDeveloperId: number;
//   technologyId: number | null;
//   technologyName: string | null;
// }

export interface ITechnology {
  id: number;
  name: string;
}

export type TTechnologyCreate = Omit<IProject, "id">;
export type TTechnologyResult = QueryResult<ITechnology>;

export interface IProject_technology {
  id: number;
  addedIn: Date;
  technologyId: number;
  projectId: number;
}
