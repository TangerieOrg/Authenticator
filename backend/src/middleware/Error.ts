// @ts-ignore
export const ErrorMiddleware = (err, req, res, next) => {
    if(!res.headersSent) {
        // Simple error handling here... in real life we might
        // want to be more specific
        console.log(`[ERR] '${err.message}'`);
        res.status(400);
        res.json({ error: err.message });
    }
}