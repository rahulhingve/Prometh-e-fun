console.log("Hello via Bun!");

import express from 'express';
import type { NextFunction, Request, Response } from 'express';

// import { middleware } from './middleware';
import client from 'prom-client';

const reqCount = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']

});


const activeReqGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Number of Active Requests'
})


const app = express();


function middleware(req: Request, res: Response, next: NextFunction) {

    if (req.path !== "/metrics") {
        activeReqGauge.inc();
    }

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[Request took ${duration}ms ]`)
        reqCount.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status: res.statusCode
        })

        if (req.path !== "/metrics") {
            activeReqGauge.dec();
        }
    });
    next();
}


app.use(middleware);

// app.use((req, res, next) => {
//     const start = Date.now();

//     res.on('finish', () => {
//         const duration = Date.now() - start;
//         console.log(`[Request took ${duration}ms on  Method ${req.method} with status ${res.statusCode} on Route ${req.route.path} ]`)
//     })
//     next();
// })



app.get('/', (req, res) => {

    res.send("Hello World");

});


app.get('/metrics', async (req, res) => {

    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
    console.log(await client.register.metrics())

});


app.listen(3000, () => {

    console.log("Server is running on port 3000");
})