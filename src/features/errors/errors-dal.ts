import consts from "@/constants";
import { MongoItemDal } from "../mongo-item-dal";
import { errorDef } from "./error-def";

class ErrorsDal extends MongoItemDal<Error> {
  constructor() {
    super(consts.collections.errors, errorDef);
  }
}

export const errorsDal = new ErrorsDal();
