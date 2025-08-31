import Joi from 'joi';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required().description('MongoDB connection URI'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_EXPIRES_IN: Joi.string().default('1d').description('JWT token expiry time'),
  STRIPE_SECRET_KEY: Joi.string().required().description('Stripe secret key'),
  STRIPE_WEBHOOK_SECRET: Joi.string().required().description('Stripe webhook secret'),
  CLIENT_URL: Joi.string().required().description('Frontend client URL'),
  EMAIL_HOST: Joi.string().description('Email host'),
  EMAIL_PORT: Joi.number().description('Email port'),
  EMAIL_USER: Joi.string().description('Email user'),
  EMAIL_PASS: Joi.string().description('Email password'),
  REDIS_URL: Joi.string().required().description('Redis connection URI'),
  SENTRY_DSN: Joi.string().description('Sentry DSN'),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URI,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  stripe: {
    secretKey: envVars.STRIPE_SECRET_KEY,
    webhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
  },
  email: {
    host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  sentry: {
    dsn: envVars.SENTRY_DSN,
  },
  clientUrl: envVars.CLIENT_URL,
};
