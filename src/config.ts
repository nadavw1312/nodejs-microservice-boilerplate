import Joi from "joi";
import dotEnv from "dotenv";

const configFile = `./.env.${process.env.NODE_ENV}`;
dotEnv.config({ path: configFile });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("prod", "dev", "qa").required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    CLIENT_URL: Joi.string().required().description("Client url"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  clientUrl: envVars.CLIENT_URL,
};

export default config;
