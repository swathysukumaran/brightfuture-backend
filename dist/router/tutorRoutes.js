"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tutorController_1 = require("../controllers/tutorController");
exports.default = (router) => {
    router.get('/api/tutors', tutorController_1.getAllTutors);
    router.post('/api/tutors', tutorController_1.createTutor);
};
//# sourceMappingURL=tutorRoutes.js.map