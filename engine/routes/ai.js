const express = require('express');
const router = express.Router();

// Mock AI Suggestions
// In a real scenario, this would accept an image upload (e.g., via multer)
// and send it to OpenAI's Vision API or another image recognition service.
const mockSuggestions = [
    {
        theme: "Aggressive Track Build",
        description: "A bold, racing-inspired look with vibrant colors and aerodynamic parts.",
        modifications: {
            paintColor: "#ff3300",
            wheels: "racing-spoke",
            spoiler: "gt-wing",
            bodyKit: "widebody"
        }
    },
    {
        theme: "Sleek Street Style",
        description: "Subtle, dark, and elegant. Perfect for night cruising.",
        modifications: {
            paintColor: "#111111",
            wheels: "sport-spoke",
            spoiler: "ducktail",
            bodyKit: "sport"
        }
    },
    {
        theme: "Show Car Stance",
        description: "Bright primary colors matched with premium aero.",
        modifications: {
            paintColor: "#00eeff",
            wheels: "classic-mesh",
            spoiler: "none",
            bodyKit: "street"
        }
    }
];

// @route   POST /api/ai/suggest
// @desc    Get AI modification suggestions based on an uploaded image
// @access  Public
router.post('/suggest', (req, res) => {
    try {
        // Typically, req.body.image or req.file would be processed here.
        // We simulate a processing delay.
        setTimeout(() => {
            // Return 2 random suggestions from the mock data
            const shuffled = [...mockSuggestions].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 2);
            
            res.json({
                message: "Image analyzed successfully.",
                suggestions: selected
            });
        }, 1500); // 1.5 second delay to simulate AI processing
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
