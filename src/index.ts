import { HttpServer } from './shared/infrastructure/http/HttpServer';

async function bootstrap() {
    const port = Number(process.env.PORT) || 3000;
    const server = new HttpServer(port);

    await server.start();
}

bootstrap().catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});
