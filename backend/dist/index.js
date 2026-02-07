"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const appointments_1 = __importDefault(require("./routes/appointments"));
const tips_1 = __importDefault(require("./routes/tips"));
const quiz_1 = __importDefault(require("./routes/quiz"));
const resources_1 = __importDefault(require("./routes/resources"));
const blog_1 = __importDefault(require("./routes/blog"));
const chat_1 = __importDefault(require("./routes/chat"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/appointments', appointments_1.default);
app.use('/api/tips', tips_1.default);
app.use('/api/quiz', quiz_1.default);
app.use('/api/resources', resources_1.default);
app.use('/api/blog', blog_1.default);
app.use('/api/chat', chat_1.default);
app.get('/', (req, res) => {
    res.send('CalmCove Backend Running');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map