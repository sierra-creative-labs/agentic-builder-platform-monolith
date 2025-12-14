import express from 'express';
import { apiV1Router } from '../api/v1';

export class HttpServer {
    private readonly app: express.Express;
    private readonly port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
        this.configureMiddlewares();
        this.configureRoutes();
    }

    private configureMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        // Add other global middlewares here (CORS, Helmet, Logger, etc.)
    }

    private configureRoutes(): void {
        // API Version 1
        this.app.use('/api/v1', apiV1Router);
    }

    async start(): Promise<void> {
        return new Promise((resolve) => {
            this.app.listen(this.port, () => {
                console.log(`Server is running at http://localhost:${this.port}`);
                console.log(`Health check: http://localhost:${this.port}/api/v1/health`);
                resolve();
            });
        });
    }
}
