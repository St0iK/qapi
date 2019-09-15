"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    host: process.env.DOCKER ? 'redis_db' : 'localhost',
    port: 6379
};
