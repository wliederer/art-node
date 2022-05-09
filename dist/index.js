"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const art_routes_1 = __importDefault(require("./routes/art.routes"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = require("./constants/corsOptions");
const app = (0, express_1.default)();
const port = 8080;
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(art_routes_1.default);
app.get("/health", (0, cors_1.default)(corsOptions_1.publicCorsConfig), (req, res) => {
    res.send('ok');
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
