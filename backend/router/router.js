const express = require("express");
const { generateResponse } = require("../controller/generativeController");
const { continueThread} = require("../controller/dataQueryController")
const router = express.Router();

router.post("/generate-response", generateResponse); // single responses for trial

router.post('/message', async (req, res) => {
    const { userId, userPrompt } = req.body; 

    if (!userId || !userPrompt) {
        return res.status(400).send('User ID and prompt are required.');
    }

    try {
        console.log(1)
        const assistantResponse = await continueThread(userId, userPrompt);
        
        res.json({ response: assistantResponse });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

module.exports = router;