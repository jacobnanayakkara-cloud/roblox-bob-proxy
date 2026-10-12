const express = require('express');
const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const response = await fetch(`https://googleapis.com{process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: req.body.messages.map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }))
            })
        });
        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply: reply });
    } catch (err) {
        res.status(500).json({ reply: "My brain is freezing up..." });
    }
});

app.listen(process.env.PORT || 3000);
