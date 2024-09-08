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
const core_1 = require("@overnightjs/core");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const AuthController_1 = require("./controllers/AuthController");
const cors_1 = __importDefault(require("cors"));
class AppServer extends core_1.Server {
    constructor() {
        super();
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.setUpControllers();
        this.setupTestRoute(); // Ensure this method is called
        this.connectDB();
    }
    setUpControllers() {
        const authController = new AuthController_1.AuthController();
        super.addControllers([authController]);
    }
    setupTestRoute() {
        this.app.get('/test', (req, res) => {
            res.send('Test route working');
        });
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = process.env.MONGO_URI; // Use process.env.MONGO_URI if configured
                yield mongoose_1.default.connect(url);
                console.log(`Database connected: ${url}`);
            }
            catch (error) {
                console.error('Error connecting to MongoDB:', error);
                process.exit(1);
            }
        });
    }
    start(port, callback) {
        this.app.listen(port, callback);
    }
}
const appServer = new AppServer();
appServer.start(3000, () => {
    console.log('Server is running on port 3000');
});
