import Joi from "joi";
import dotEnv from "dotenv";

const configFile = `./.env.${process.env.NODE_ENV}`;
dotEnv.config({ path: configFile });

interface Config {
  NODE_ENV: "prod" | "dev" | "qa";
  PORT: number;
  APP_SECRET: string;
  MONGODB_URL: string;
  CLIENT_URL: string;
  RABBITMQ_URL: string;
  EXCHANGE_NAME: string;
}

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("prod", "dev", "qa").required(),
    PORT: Joi.number().default(3000),
    APP_SECRET: Joi.string().required().description("App secret"),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    CLIENT_URL: Joi.string().required().description("Client url"),
    RABBITMQ_URL: Joi.string().required().description("RabbiotMQ server url"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config: Config = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  APP_SECRET: envVars.APP_SECRET,
  MONGODB_URL: envVars.MONGODB_URL,
  CLIENT_URL: envVars.CLIENT_URL,
  RABBITMQ_URL: envVars.RABBITMQ_URL,
  EXCHANGE_NAME: envVars.EXCHANGE_NAME,
};

export default config;
