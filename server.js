const express = require('express');
const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const formattedContents = req.body.messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || "" }]
        }));

        const response = await fetch(`https://googleapis.com{process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: formattedContents })
        });

        const data = await response.json();
        
        // Robust fallback checking for Google Gemini's exact text layout arrays
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const reply = data.candidates[0].content.parts[0].text;
            res.json({ reply: reply });
        } else {
            console.error("Unexpected Gemini Layout:", JSON.stringify(data));
            res.json({ reply: "My brain is freezing up... what did you say?" });
        }
    } catch (err) {
        console.error("Proxy System Error:", err);
        res.status(500).json({ reply: "Connection dropped... try speaking again!" });
    }
});

app.listen(process.env.PORT || 3000);
