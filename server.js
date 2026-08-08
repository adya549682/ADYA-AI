const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Put your Hugging Face token between the quotes.
// DO NOT send the token to me.
const HF_TOKEN = process.env.HF_TOKEN;

app.use(express.json());

app.use(express.static(__dirname));


app.post("/api/chat", async function (req, res) {

    try {

        const messages = req.body.messages;

        if (!Array.isArray(messages)) {

            return res.status(400).json({
                error: "Messages are missing."
            });

        }


        console.log("Sending request to Hugging Face...");


        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": "Bearer " + HF_TOKEN,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "moonshotai/Kimi-K3",

                    messages: messages,

                    temperature: 0.7,

                    max_tokens: 1000

                })
            }
        );


        const data = await response.json();


        console.log("STATUS:", response.status);
        console.log("RESPONSE:", data);


        if (!response.ok) {

            return res.status(response.status).json({

                error: JSON.stringify(data)

            });

        }


        res.json(data);


    } catch (error) {

        console.log("SERVER ERROR:", error);

        res.status(500).json({

            error: error.message

        });

    }

});


app.listen(PORT, function () {

    console.log(
        "ADYA AI is running at http://localhost:" + PORT
    );

});

