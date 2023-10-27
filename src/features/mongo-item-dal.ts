import { mongoUtils } from "@/utils/mongo-utils";
import { schemaUtils } from "@/utils/schema-utils";
import { Document } from "mongodb";

class MongoItemDal<IDoc extends Document = Document> {
  collectionName: string;
  jsonSchema;

  constructor(collectionName, jsonSchema) {
    this.collectionName = collectionName;
    this.jsonSchema = jsonSchema;
  }

  protected async getCollection() {
    return await mongoUtils.getCollection<IDoc>(this.collectionName);
  }

  async initJsonSchemaValidator() {
    const db = await mongoUtils.getDB();
    try {
      await db.createCollection(this.collectionName);
      if (this.jsonSchema) {
        const mongoJsonSchema = schemaUtils.addRequiredTimeStamp(this.jsonSchema);
        db.command({
          collMod: this.collectionName,
          validator: {
            $jsonSchema: mongoJsonSchema,
          },
        });
      }
    } catch (error) {}
  }

  async insert(item) {
    this.addTimestamp(item);
    const collection = await this.getCollection();
    const res = await collection.insertOne(item as any);

    return res;
  }

  async update(item: IDoc) {
    this.updateTimestamp(item);
    const collection = await this.getCollection();
    const res = await collection.updateOne({ _id: item._id }, { $set: item });

    return res;
  }

  async delete(id: string) {
    const collection = await this.getCollection();
    await collection.deleteOne()
  }

  addTimestamp(item) {
    item.createDate = new Date();
    item.updateDate = new Date();
  }

  updateTimestamp(item) {
    item.updateDate = new Date();
  }
}

export { MongoItemDal };
