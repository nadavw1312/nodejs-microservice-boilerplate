import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import routes from "./routes/v1";
import httpStatus from "http-status";
import { errorConverter, errorHandler } from "./middlewares/error-middleware";

const app: Express = express();

// set security HTTP headers
app.use(helmet());
// enable cors
app.use(cors());
app.options("*", cors());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(ExpressMongoSanitize());
// v1 api routes
app.use("/api/v1", routes);
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  _res.status(httpStatus.NOT_FOUND).send("Not found");
});
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

export default app;
