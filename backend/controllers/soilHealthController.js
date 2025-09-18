// controllers/soilHealthController.js
import asyncHandler from 'express-async-handler';

/**
 * @desc    Fetch soil health data for a given location
 * @route   GET /api/soil?lat=<latitude>&lon=<longitude>
 * @access  Private
 */
export const getSoilHealthData = asyncHandler(async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        res.status(400);
        throw new Error('Latitude and longitude are required');
    }

    // This data would come from a soil database or sensor API.
    // We'll generate dynamic mock data based on location.
    const mockSoilData = {
        moisture: (40 + (parseFloat(lat) % 15)).toFixed(1),
        ph: (6.0 + (parseFloat(lon) % 1.5)).toFixed(1),
        nitrogen: Math.floor(120 + (parseFloat(lat) % 40)),
        phosphorus: Math.floor(60 + (parseFloat(lon) % 25)),
        potassium: Math.floor(200 + (parseFloat(lat) % 50)),
        temperature: (22 + (parseFloat(lon) % 8)).toFixed(1),
        recommendations: [
            `Analysis complete for your location.`,
            "Nitrogen levels are optimal for vegetative growth.",
            "Consider adding compost to improve organic matter."
        ]
    };

    res.json(mockSoilData);
});