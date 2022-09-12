export interface IDatabseConfigAttributes {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number | string;
  dialect?: string;
  urlDatabase?: string;
}

export interface IDatabaseConfig {
  development: IDatabseConfigAttributes;
  test: IDatabseConfigAttributes;
  production: IDatabseConfigAttributes;
}
