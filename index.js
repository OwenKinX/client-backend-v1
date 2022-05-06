const http = require('http')
const app = require('./app')
const logger = require('./utils/logger')

const server = http.createServer(app)
const { API_PORT } = process.env

// Capture 404
app.use((req,res,next) => {
    res.status(404).send("PAGE NOT FOUND");
    logger.error(`404 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})

// capture error
app.use((err,req,res,next) => {
    res.status(500).send(err);
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})

server.listen(API_PORT, () => {
    console.log(`Server is running on http://localhost:${API_PORT}`);
    logger.info(`Server started and running on http://localhost::${API_PORT}`)
})