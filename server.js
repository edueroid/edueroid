const http = require('http');
const app = require('./app');

const port = process.env.PORT ;

const server = http.createServer();

server.listen(port);

