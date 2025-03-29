"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrip = exports.createTrip = void 0;
const AIprompt_1 = require("../helpers/AIprompt");
const AIModel_1 = require("../helpers/AIModel");
const lodash_1 = require("lodash");
const trip_1 = require("../db/trip");
const createTrip = async (req, res) => {
    try {
        const { location, timeframe, travelers, preferences, budget } = req.body;
        const userId = (0, lodash_1.get)(req, 'identity._id');
        const FINAL_PROMPT = (0, AIprompt_1.AI_PROMPT)(location.label, timeframe, travelers, preferences, budget);
        if (AIModel_1.chatSession) {
            const result = await AIModel_1.chatSession.sendMessage(FINAL_PROMPT);
            const resultText = result.response.candidates[0].content.parts[0].text;
            const aiResponse = resultText.replace(/```json\n|\n```/g, '');
            const parsedResponse = JSON.parse(aiResponse);
            const narrative = parsedResponse.tripDetails.narrative;
            const generatedItinerary = parsedResponse.generatedItinerary;
            const trip = await (0, trip_1.createNewTrip)(userId, { location, timeframe, narrative, travelers,
                preferences, budget }, generatedItinerary);
            res.status(200).json({
                tripId: trip._id,
            });
            return;
        }
        else {
            res.status(400).send("Chat session not found");
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};
exports.createTrip = createTrip;
const updateTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { changeRequest } = req.body;
        const userId = (0, lodash_1.get)(req, 'identity._id');
        const trip = await (0, trip_1.getTripById)(tripId);
        if (!trip) {
            res.status(404).json({ error: "Trip not found" });
            return;
        }
        const FINAL_PROMPT = (0, AIprompt_1.UPDATE_PROMPT)(trip, changeRequest);
        if (AIModel_1.chatSession) {
            const result = await AIModel_1.chatSession.sendMessage(FINAL_PROMPT);
            const resultText = result.response.candidates[0].content.parts[0].text;
            const aiResponse = resultText.replace(/```json\n|\n```/g, '');
            const parsedResponse = JSON.parse(aiResponse);
            const generatedItinerary = parsedResponse;
            const trip = await (0, trip_1.updateTripItinerary)(userId, tripId, generatedItinerary);
            res.status(200).json(trip);
            return;
        }
        else {
            res.status(400).send("Chat session not found");
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};
exports.updateTrip = updateTrip;
//# sourceMappingURL=gemini.js.map