"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("./authentication"));
const AI_1 = __importDefault(require("./AI"));
const users_1 = __importDefault(require("./users"));
const tripDetails_1 = __importDefault(require("./tripDetails"));
const onboarding_1 = __importDefault(require("./onboarding"));
const preferences_1 = __importDefault(require("./preferences"));
const speechRoutes_1 = __importDefault(require("./speechRoutes"));
const tutorRoutes_1 = __importDefault(require("./tutorRoutes"));
const appointmentRoutes_1 = __importDefault(require("./appointmentRoutes"));
const router = express_1.default.Router();
exports.default = () => {
    (0, authentication_1.default)(router);
    (0, AI_1.default)(router);
    (0, users_1.default)(router);
    (0, tripDetails_1.default)(router);
    (0, preferences_1.default)(router);
    (0, onboarding_1.default)(router);
    (0, speechRoutes_1.default)(router);
    (0, tutorRoutes_1.default)(router);
    (0, appointmentRoutes_1.default)(router);
    return router;
};
//# sourceMappingURL=index.js.map