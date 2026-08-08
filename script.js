const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

app.post("/api/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "moonshotai/Kimi-K3",
                    messages: messages,
                    max_tokens: 1000
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || "Hugging Face request failed."
            });
        }

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Server error: " + error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`My AI is running at http://localhost:${PORT}`);
});