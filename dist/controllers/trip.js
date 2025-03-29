"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTrips = exports.getTripDetails = void 0;
const lodash_1 = require("lodash");
const trip_1 = require("../db/trip");
const getTripDetails = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const trip = await (0, trip_1.getTripById)(tripId);
        res.status(200).json(trip);
        return;
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};
exports.getTripDetails = getTripDetails;
const getAllTrips = async (req, res) => {
    try {
        const userId = (0, lodash_1.get)(req, 'identity._id');
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const trips = await (0, trip_1.getUserTrips)(userId);
        res.status(200).json({ trips });
        return;
    }
    catch (error) {
        console.error('Error fetching user trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
        return;
    }
};
exports.getAllTrips = getAllTrips;
//# sourceMappingURL=trip.js.map