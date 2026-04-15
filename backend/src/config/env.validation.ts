import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DB_CONNECTION_STRING: Joi.string().required(),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().default('*'),
}).unknown(true);
