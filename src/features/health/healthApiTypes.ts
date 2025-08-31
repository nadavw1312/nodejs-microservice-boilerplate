export interface HealthResponse {
    /** The status of the service */
    status: 'ok' | 'error';
}

export interface PingResponse {
    /** ISO timestamp of the server */
    timestamp: string;
}
