import "reflect-metadata";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import httpStatus from "http-status";
import { errorConverter, errorHandler } from "./middlewares/error-middleware";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes";
import swaggerJson from "./swagger.json";
import "./container"; // This will initialize the container
import { container } from "tsyringe";
import { MongoClient } from "mongodb";
import { transactionMiddleware } from "./middlewares/transaction-middleware";

// Dependencies are registered in container.ts

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

// Add transaction middleware
const mongoClient = container.resolve<MongoClient>('MongoClient');
app.use(transactionMiddleware(mongoClient));

// Register routes
RegisterRoutes(app);
app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(`Route registered: ${r.route.path}`);
  }
});

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
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
