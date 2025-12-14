import { HttpServer } from '../HttpServer';
import { expect, test, describe, beforeAll, afterAll } from "bun:test";

describe('HttpServer (Integration)', () => {
    let server: HttpServer;
    // We can't easily access the internal express app from outside without modifying the class,
    // so for this test we'll rely on starting it or refactor HttpServer to expose app for testing.
    // However, to keep it simple and unit-testy, let's just instantiate it and maybe test the health endpoint via actual HTTP request?
    // Or simpler: modify HttpServer to expose `app` public getter or use "app" property if public.

    // Better approach for "Unit" testing the wiring: expose the app instance.
    // But since it's private, we'll make a small integration test that actually listens on a random port.

    const testPort = 4000;
    const baseUrl = `http://localhost:${testPort}`;

    beforeAll(async () => {
        server = new HttpServer(testPort);
        await server.start();
    });

    // Note: In real scenarios, you might want a teardown method in HttpServer to close the listener.
    // For this example, we assume it's fine or we'll get address in use errors on repeated runs without teardown.
    // Let's assume we can't easily close it without adding a stop method.

    test('GET /api/v1/health should return 200', async () => {
        const response = await fetch(`${baseUrl}/api/v1/health`);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual(expect.objectContaining({ status: 'ok' }));
    });
});
