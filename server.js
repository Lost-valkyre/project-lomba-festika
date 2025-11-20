import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// ====== MASUKKAN API KEY KAMU DI SINI ======
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ====== ROUTE ====
app.post("/api/generate", async (req, res) => {
  try {
    const { topic, grade, type, count } = req.body;

    const prompt = `
      Buatkan ${count} soal tipe ${type} untuk kelas ${grade}.
      Topik: ${topic}
      Format ringkas dan jelas.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });

    return res.json({
      quizText: completion.choices[0].message.content.trim()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====== START ======
app.listen(3000, () => console.log("Server running on port 3000"));
