import { Request, Response, NextFunction } from "express";

class RequestUtils {
  public async finalAction(action: Function, req: Request, res: Response, next: NextFunction) {
    try {
      const result = action();

      if (result && result.then) {
        const response = await result;
        res.send(response);
      } else {
        res.send(result);
      }
    } catch (err) {
      next(err);
    }
  }
}

export default new RequestUtils();
