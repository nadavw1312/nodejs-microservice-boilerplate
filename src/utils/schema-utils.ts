var cloneDeep = require("lodash.clonedeep");

class SchemaUtils {
  addRequiredTimeStamp(schema) {
    const def = cloneDeep(schema);
    def.properties.createDate = { bsonType: "date" };
    def.properties.updateDate = { bsonType: "date" };
    return def;
  }

  getValidTypescript(schema) {
    const def = cloneDeep(schema);
    def.properties["createDate"].tsType = "Date";
    def.properties["updateDate"].tsType = "Date";

    return def;
  }
}

export const schemaUtils = new SchemaUtils();
