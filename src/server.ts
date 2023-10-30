import "module-alias/register";
import app from "./app";
import logger from "@utils/logger";
import config from "@/config";

let server: any;

server = app.listen(config.PORT, () => {
  logger.info(`Listening to port ${config.PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
