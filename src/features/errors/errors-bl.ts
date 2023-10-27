import { errorsDal } from "./errors-dal";

class ErrorsBl {
  async insert(error) {
    return await errorsDal.insert(error);
  }

  async createApiError({ message, stack, extraInfo = {}, req }) {
    const error = {
      message,
      stack,
      clientIp: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      extraInfo,
    };

    const res = await this.insert(error);

    return res.insertedId;
  }
}

export const errorsBl = new ErrorsBl();
