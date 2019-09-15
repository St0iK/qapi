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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get current timestamp
    const start = Date.now();
    // continue with the rest of the middlewares to build request
    yield next();
    // when they are all finsihed, calculate the difference
    const ms = Date.now() - start;
    ctx.set('quotes-api-response-time', `${ms}ms`);
});
