import { Request, Response, NextFunction } from 'express';
import { MongoClient } from 'mongodb';
import { withSession } from '../utils/session-context';

export const transactionMiddleware = (client: MongoClient) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const session = client.startSession();
        let isTransactionHandled = false;

        try {
            await withSession(session, async () => {
                await session.startTransaction();

                // Store the original send function
                const originalSend = res.send;

                // Override send to handle transaction completion
                res.send = function (this: Response, ...args: any[]) {
                    const handleTransaction = async () => {
                        if (isTransactionHandled) {
                            return;
                        }
                        isTransactionHandled = true;

                        try {
                            if (res.statusCode >= 200 && res.statusCode < 300) {
                                await session.commitTransaction();
                            } else {
                                await session.abortTransaction();
                            }
                        } finally {
                            await session.endSession();
                        }
                    };

                    // Handle the transaction after the response is sent
                    handleTransaction().catch(console.error);

                    // Call the original send function
                    return originalSend.apply(this, args);
                };

                // Handle errors
                const handleError = async (err: any) => {
                    if (!isTransactionHandled) {
                        isTransactionHandled = true;
                        try {
                            await session.abortTransaction();
                        } finally {
                            await session.endSession();
                        }
                    }
                    throw err;
                };

                try {
                    next();
                } catch (err) {
                    await handleError(err);
                }
            });
        } catch (error) {
            if (!isTransactionHandled) {
                isTransactionHandled = true;
                await session.abortTransaction().catch(() => {});
                await session.endSession().catch(() => {});
            }
            next(error);
        }
    };
};
