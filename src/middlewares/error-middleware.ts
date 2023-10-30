/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "@/utils/errors/ApiError";

import config from "../config";
import logger from "../utils/logger";
import errorsBl from "@/features/errors/errors-bl";

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = error.message || `${httpStatus[statusCode]}`;
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = async (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  let errorId;

  try {
    errorId = await errorsBl.createApiError({ message, stack: err.stack, req: _req });
  } catch (error) {
    logger.warn(`Failed to insert error to db, \n ${error.toString()}`);
  }

  if (config.NODE_ENV === "prod" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Internal Server Error";
  }

  res.locals["errorMessage"] = err.message;

  const response = {
    code: statusCode,
    message,
    errorId,
    ...(config.NODE_ENV === "dev" && {
      stack: err.stack,
    }),
  };

  if (config.NODE_ENV === "dev") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
