const http = require('http')
const app = require('./app')
const port = process.env.Port || 5010
const server = http.createServer(app)
server.listen(port)
