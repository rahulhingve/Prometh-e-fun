console.log("Hello via Bun!");

import express from 'express';

import { middleware } from './middleware';


const app = express();
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

app.listen(3000, () => {

    console.log("Server is running on port 3000");
})