CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(30) NOT NULL,
  username VARCHAR(15) NOT NULL,
  password BYTEA NOT NULL
)
