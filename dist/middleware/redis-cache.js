"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
exports.default = (opts = {}) => {
    const redisUrl = `redis://${opts.host}:${opts.port}/`;
    let redisAvailable = false;
    const redis = new ioredis_1.default(redisUrl);
    redis.on('error', () => {
        redisAvailable = false;
    });
    redis.on('end', () => {
        redisAvailable = false;
    });
    redis.on('connect', () => {
        redisAvailable = true;
    });
    /**
     * @param {*} ctx
     * @param {*} typeKey
     * @param {*} cacheExpire
     */
    const cacheType = (ctx, typeKey, cacheExpire) => __awaiter(void 0, void 0, void 0, function* () {
        // Export 'type' from the object that you will get from the response
        const { type } = ctx.response;
        yield redis.set(typeKey, type, 'EX', cacheExpire);
    });
    /**
     * @param {*} ctx
     * @param {*} countKey
     * @param {*} cacheExpire
     */
    const cacheCount = (ctx, countKey, cacheExpire) => __awaiter(void 0, void 0, void 0, function* () {
        // Export 'count' from the object that you will get from the response
        const { count } = ctx.state;
        if (count) {
            yield redis.set(countKey, count, 'EX', cacheExpire);
        }
    });
    const cacheContent = (ctx, key, typeKey, countKey, cacheExpire) => __awaiter(void 0, void 0, void 0, function* () {
        // Export 'body' from the object that you will get from the response
        let { body } = ctx.response;
        if ((ctx.request.method !== 'GET') || (ctx.response.status !== 200) || !body) {
            return;
        }
        if (typeof body === 'string') {
            yield redis.set(key, body, 'EX', cacheExpire);
        }
        if (typeof body === 'object' && ctx.response.type === 'application/json') {
            console.log('application/json');
            body = JSON.stringify(body);
            yield redis.set(key, body, 'EX', cacheExpire);
        }
        yield cacheType(ctx, typeKey, cacheExpire);
        yield cacheCount(ctx, countKey, cacheExpire);
        ctx.response.set('quotes-api-cache', 'MISS');
    });
    const getCache = (ctx, key, tkey, ckey) => __awaiter(void 0, void 0, void 0, function* () {
        const value = yield redis.get(key);
        const count = yield redis.get(ckey);
        let cached = false;
        if (value) {
            ctx.response.status = 200;
            const type = (yield redis.get(tkey)) || 'text/html';
            ctx.response.set('quotes-api-cache', 'HIT');
            ctx.response.type = 'application/json';
            ctx.response.body = value;
            cached = true;
        }
        if (count) {
            ctx.response.set('quotes-api-count', count);
        }
        return cached;
    });
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { url } = ctx.request;
        const key = `redis-cache:${url}`;
        const tkey = `${key}:type`;
        const ckey = `${key}:count`;
        if (!redisAvailable) {
            return;
        }
        let cached;
        try {
            cached = yield getCache(ctx, key, tkey, ckey);
        }
        catch (error) {
            console.log(error);
            cached = false;
        }
        if (cached) {
            return;
        }
        // continue with the rest of the middlewares to build the response
        yield next();
        console.log('Content served from db');
        try {
            yield cacheContent(ctx, key, tkey, ckey, 10000);
        }
        catch (e) {
            console.log('Failed to set cache');
        }
    });
};
