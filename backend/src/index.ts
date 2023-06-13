import dotenv from 'dotenv';
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), process.env.NODE_ENV === 'development' ? ".env.development" : ".env")
});

import server from './server';

const port = process.env.EXPRESS_PORT ?? 80;

server.listen(port, () => {
    console.log("Listening on port", port);
});