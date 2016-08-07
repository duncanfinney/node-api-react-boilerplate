create table matches(
  id SERIAL    PRIMARY KEY,
  match_uuid   UUID NOT NULL,
  raw_data     JSONB
);
