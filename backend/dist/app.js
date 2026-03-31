"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const veterans_routes_1 = __importDefault(require("./routes/veterans.routes"));
const serviceRequests_routes_1 = __importDefault(require("./routes/serviceRequests.routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions)); // <-- handles preflight
app.use(express_1.default.json());
// routes
app.use('/api/veterans', veterans_routes_1.default);
app.use('/api/service-requests', serviceRequests_routes_1.default);
app.get('/', (_req, res) => {
    res.send('VetServe API is running');
});
exports.default = app;
