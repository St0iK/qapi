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
const koa_1 = __importDefault(require("koa"));
const logger_1 = __importDefault(require("./loaders/logger"));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = new koa_1.default();
        yield require('./loaders').default({ koaApp: app });
        try {
            const port = parseInt(process.env.PORT) || 5000;
            const hostname = '127.0.0.1';
            app.listen(port, hostname, () => {
                app.emit('ready');
                logger_1.default.info(`
      ################################################
      🛡️  Server listening on port: ${port} 🛡️ 
      ################################################
    `);
            });
        }
        catch (err) {
            console.log(err.stack);
        }
    });
}
startServer();
