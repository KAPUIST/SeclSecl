import * as Joi from 'joi'

export const configModuleValidationSchema = Joi.object({
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().required(),
  MAIN_ACCESS_TOKEN_SECRET: Joi.string().required(),
  MAIN_ACCESS_TOKEN_EXPIRES: Joi.string().required(),
  MAIN_REFRESH_TOKEN_SECRET: Joi.string().required(),
  MAIN_REFRESH_TOKEN_EXPIRES: Joi.string().required(),
  BASE_URL: Joi.string().required(),
})
