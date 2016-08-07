create table matches(
  id SERIAL    PRIMARY KEY,
  match_uuid   UUID UNIQUE NOT NULL,
  raw_data     JSONB
);
