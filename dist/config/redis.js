"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    host: process.env.DOCKER ? 'redis_db' : 'localhost',
    port: 6379
};
exports.config = config;
