"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("./models"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Application-Level Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.context = {
        models: models_1.default,
        url: `${req.protocol}://${req.get('host')}`,
    };
    next();
});
// Routes
app.use('/chord', routes_1.default.chord);
app.use('/scale', routes_1.default.scale);
app.use('/interval', routes_1.default.interval);
// Start
app.listen(process.env.PORT, () => console.log(`Example app listenin on port ${process.env.PORT}!`));
