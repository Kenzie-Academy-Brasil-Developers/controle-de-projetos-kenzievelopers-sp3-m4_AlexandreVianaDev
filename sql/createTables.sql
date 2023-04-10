CREATE TABLE IF NOT EXISTS developers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS developers_infos (
  id SERIAL PRIMARY KEY,
  developerSince DATE NOT NULL,
  preferredOS ENUM('Windows', 'Linux', 'MacOS') NOT NULL,
  developerId INTEGER UNIQUE NOT NULL,
  FOREIGN KEY (developerId) REFERENCES developers(id)
);

