import express from 'express';
import path from 'path';
import fs from 'fs';
import logger from '../logger.js';
import http from 'http';

const app = express();
const port = process.env.APP_PORT || 3000;
let server;

async function initialize() {
  app.use('/', express.static('build'));

  server = http.createServer(app);
  server.listen(port, () => {
    logger.success(`HTTP server listening on port ${port}`);
  });
}

function getServer() {
  return server;
}

export default {
  initialize,
  getServer,
}