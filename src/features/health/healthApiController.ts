import { Controller, Get, Middlewares, Route, Tags } from 'tsoa';
import { HealthResponse, PingResponse } from './healthApiTypes';

@Route('health')
@Tags('Health')
export class HealthController extends Controller {
    /**
     * Check if the service is healthy
     */
    @Get('/')
    @Middlewares([])
    public async getHealth(): Promise<HealthResponse> {
        return {
            status: 'ok'
        };
    }

    /**
     * Get server timestamp
     */
    @Get('/ping')
    public async ping(): Promise<PingResponse> {
        return {
            timestamp: new Date().toISOString()
        };
    }
}
