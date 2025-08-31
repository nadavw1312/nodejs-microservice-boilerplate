import { AsyncLocalStorage } from 'async_hooks';
import { ClientSession } from 'mongodb';

interface RequestContext {
    session?: ClientSession;
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const getSession = (): ClientSession | undefined => {
    const context = asyncLocalStorage.getStore();
    return context?.session;
};

export const withSession = async <T>(
    session: ClientSession,
    operation: () => Promise<T>
): Promise<T> => {
    return asyncLocalStorage.run({ session }, operation);
};
