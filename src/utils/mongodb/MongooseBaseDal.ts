import { Document, Model, FilterQuery, ClientSession } from "mongoose";

export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export default class MongooseBaseDal<T extends BaseDocument> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<Omit<T, keyof Document>>): Promise<T> {
    const doc = await this.model.create(data);
    return doc.toObject();
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id).lean();
    return doc as T | null;
  }

  async findAll(
    query: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10,
    populate?: string | string[]
  ): Promise<PaginatedResult<T>> {
    const skip = (page - 1) * limit;

    let findQuery = this.model.find(query).skip(skip).limit(limit);

    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((path) => {
          findQuery = findQuery.populate(path);
        });
      } else {
        findQuery = findQuery.populate(populate);
      }
    }

    const [items, total] = await Promise.all([findQuery.lean(), this.model.countDocuments(query)]);

    return {
      items: items as T[],
      total,
      page,
      limit,
    };
  }

  async update(id: string, data: Partial<Omit<T, keyof Document>>): Promise<T | null> {
    const doc = await this.model.findByIdAndUpdate(id, data as FilterQuery<T>, { new: true }).lean();
    return doc as T;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  protected async withTransaction<R>(operation: (session: ClientSession) => Promise<R>): Promise<R> {
    const session = await this.model.startSession();
    try {
      session.startTransaction();
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
