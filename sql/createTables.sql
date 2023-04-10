CREATE TABLE IF NOT EXISTS developers (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS developers_infos (
  "id" SERIAL PRIMARY KEY,
  "developerSince" DATE NOT NULL,
  "preferredOS" ENUM('Windows', 'Linux', 'MacOS') NOT NULL,
  "developerId" INTEGER UNIQUE NOT NULL,
  FOREIGN KEY ("developerId") REFERENCES developers("id") ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS projects (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "description" TEXT,
  "estimatedTime" VARCHAR(20) NOT NULL,
  "repository" VARCHAR(120) NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE,
  "developerId" INTEGER NOT NULL,
  FOREIGN KEY ("developerId") REFERENCES developers("id") ON DELETE SET NULL 
);

CREATE TABLE IF NOT EXISTS technologies (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(30) NOT NULL
);