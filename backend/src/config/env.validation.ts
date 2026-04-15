import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  KEY_VAULT_URL: Joi.string().uri().required().messages({
    'string.uri':
      'KEY_VAULT_URL must be a valid URI (e.g., https://my-vault.vault.azure.net)',
    'any.required': 'KEY_VAULT_URL is required — set it in .env',
  }),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().default('*'),
}).unknown(true);
