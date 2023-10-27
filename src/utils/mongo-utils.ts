import { Collection, Db, MongoClient } from "mongodb";

class MongoUtils {
  private _db: Db;
  private _isConnected = false;

  connectToDB = async () => {
    try {
      const client = new MongoClient(process.env.DB_URL);
      // Use connect method to connect to the server
      await client.connect();
      this._isConnected = true;
      console.log("database connected");
      this._db = client.db(process.env.DB_NAME);
    } catch (error) {
      this._isConnected = false;
      console.error(error);
      process.exit(1);
    }
  };

  public async getDB() {
    if (this._isConnected) {
      return this._db;
    } else {
      await this.connectToDB();

      return this._db;
    }
  }

  public async getCollection<IDoc>(collectionName): Promise<Collection<IDoc>> {
    await this.getDB();

    return this._db.collection<IDoc>(collectionName);
  }
}

export const mongoUtils = new MongoUtils();
