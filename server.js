const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("MaoMao server ishlayapti!");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: "Xabar bo'sh" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions: "Sen MaoMao ismli mehribon virtual mushuksan. O'zbek tilida samimiy va qisqa javob ber.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "AI so'rovida xatolik yuz berdi"
      });
    }

    const answer = data.output
      ?.flatMap(item => item.content || [])
      .find(item => item.type === "output_text")?.text;

    res.json({ reply: answer || "Miyov! Yana bir marta yoz 😺" });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik yuz berdi" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`MaoMao server ${PORT} portda ishlayapti`);
});
