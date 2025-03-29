"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appointmentController_1 = require("../controllers/appointmentController");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.get('/api/appointments', middlewares_1.isAuthenticated, appointmentController_1.getAppointmentsByStudent);
    router.post('/api/appointments', middlewares_1.isAuthenticated, appointmentController_1.createAppointment);
};
//# sourceMappingURL=appointmentRoutes.js.map