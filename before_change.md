# 📂 Project Architecture Guidelines

This project follows a **feature-based modular structure** with clear separation of concerns:
- **API (Express Router)** – routes, validations, delegating to controllers
- **Controller** – receives HTTP requests, calls BL, sends HTTP responses
- **Business Logic (BL)** – workflows, validation rules, orchestration
- **Data Access Layer (DAL)** – direct data fetching/persistence (DB, external APIs)

---

## 🔹 Folder Structure

src/
├── features/
│ ├── health/
│ │ ├── healthApiController.ts # Controller with route decorators
│ │ ├── healthApiTypes.ts # TypeScript interfaces
│ │ ├── healthBl.ts # Business logic
│ │ ├── healthDal.ts # Data access layer
│ │ └── index.ts # Exports (optional)
│ ├── orders/
│ │ └── ...
├── utils/ # Shared utilities (logger, validator)
├── middlewares/ # middlewares 
├── config/ # Env config
├── app.ts # Express app bootstrap
└── server.ts # Server start


## 🔹 Layer Responsibilities

### **Controller Layer (`*ApiController.ts`)**
- Defines routes using tsoa decorators
- Handles HTTP requests/responses
- Delegates to business logic
- Built-in OpenAPI/Swagger documentation
- Automatic request validation

Example:
```ts
import { Controller, Get, Route, Tags } from 'tsoa';
import { HealthResponse, PingResponse } from './healthApiTypes';

@Route('health')
@Tags('Health')
export class HealthController extends Controller {
    constructor(private healthBl: HealthBl) {
        super();
    }

    /**
     * Check if the service is healthy
     */
    @Get('/')
    public async getHealth(): Promise<HealthResponse> {
        return this.healthBl.checkHealth();
    }

    /**
     * Get server timestamp and system stats
     */
    @Get('/ping')
    public async ping(): Promise<PingResponse> {
        return this.healthBl.getSystemStats();
    }
}
```

### **Business Logic Layer (`*Bl.ts`)**
```ts
import { HealthResponse, PingResponse } from './healthApiTypes';
import { HealthDal } from './healthDal';
import { injectable } from 'tsyringe';

@injectable()
export class HealthBl {
    constructor(private healthDal: HealthDal) {}

    async checkHealth(): Promise<HealthResponse> {
        // Orchestrate multiple health checks
        const [dbHealth, cacheHealth] = await Promise.all([
            this.healthDal.checkDatabaseConnection(),
            this.healthDal.checkCacheConnection()
        ]);

        return {
            status: dbHealth && cacheHealth ? 'ok' : 'error'
        };
    }

    async getSystemStats(): Promise<PingResponse> {
        const stats = await this.healthDal.getSystemMetrics();
        return {
            timestamp: new Date().toISOString(),
            ...stats
        };
    }
}
```

### **Data Access Layer (`*Dal.ts`)**
```ts
import { injectable } from 'tsyringe';
import { SystemMetrics } from './healthApiTypes';

@injectable()
export class HealthDal {
    async checkDatabaseConnection(): Promise<boolean> {
        try {
            // Check DB connection
            return true;
        } catch (error) {
            return false;
        }
    }

    async checkCacheConnection(): Promise<boolean> {
        try {
            // Check Redis/cache connection
            return true;
        } catch (error) {
            return false;
        }
    }

    async getSystemMetrics(): Promise<SystemMetrics> {
        // Get real metrics from system
        return {
            cpuUsage: process.cpuUsage(),
            memoryUsage: process.memoryUsage()
        };
    }
}

### **Types Layer (`*ApiTypes.ts`)**
```ts
/** System CPU and memory metrics */
export interface SystemMetrics {
    /** CPU usage statistics */
    cpuUsage: {
        user: number;
        system: number;
    };
    /** Memory usage statistics in bytes */
    memoryUsage: {
        heapUsed: number;
        heapTotal: number;
    };
}

/** Health check response */
export interface HealthResponse {
    /** The status of the service */
    status: 'ok' | 'error';
}

/** System status response with metrics */
export interface PingResponse extends SystemMetrics {
    /** ISO timestamp of the server */
    timestamp: string;
}
```

- TypeScript interfaces with JSDoc comments
- Automatically generates OpenAPI/Swagger schemas
- Used for request/response type validation

🔹 Conventions

Imports use module aliases (@features/products, @utils/logger).

Validation → API layer only.

Logging → always use @utils/logger.

No cross-feature imports: communicate only via BL exports.

Error handling → central middleware in app.ts.

🔹 Example Flow (Health Check)

Request: GET /api/v1/health/ping

1. tsoa routing → validates request and routes to HealthController
2. HealthController.ping() → calls HealthBl.getSystemStats()
3. HealthBl orchestrates → calls HealthDal.getSystemMetrics()
4. HealthDal → gets real metrics from system
5. Response flows back up:
   - DAL returns raw metrics
   - BL adds timestamp and formats data
   - Controller ensures type safety
   - tsoa validates against PingResponse type and sends JSON

Benefits:
- Automatic OpenAPI/Swagger documentation
- Type-safe request/response handling
- Built-in validation through TypeScript types
- Clean, decorator-based routing