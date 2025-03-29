"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentSchema = new mongoose_1.default.Schema({
    tutorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    studentId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true }, // Change to ObjectId
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    title: { type: String, required: true },
});
module.exports = mongoose_1.default.model('Appointment', appointmentSchema);
//# sourceMappingURL=Appointment.js.map