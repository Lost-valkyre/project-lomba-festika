// === CONFIG BACKEND ===
// Gunakan domain backend Vercel
const BACKEND_URL = "https://project-lomba-backend.vercel.app";

// Ambil elemen HTML
const form = document.getElementById("quizForm");
const resultEl = document.getElementById("result");
const copyBtn = document.getElementById("copy");
const downloadBtn = document.getElementById("download");

// Saat form di-submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const topic = document.getElementById("topic").value.trim();
  const grade = document.getElementById("grade").value;
  const type = document.getElementById("type").value;
  const count = parseInt(document.getElementById("count").value);

  resultEl.textContent = "⏳ Sedang membuat soal dari AI…";

  try {
    // Lakukan POST ke backend
    const resp = await fetch(`${BACKEND_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ topic, grade, type, count })
    });

    // Kalau gagal (misal 404, 500)
    if (!resp.ok) {
      throw new Error(`Backend error: ${resp.status}`);
    }

    const data = await resp.json();

    if (data.quizText) {
      resultEl.textContent = data.quizText;
      return;
    }

    // Jika format tidak sesuai → fallback
    resultEl.textContent = generateLocalQuiz(topic, grade, type, count);

  } catch (err) {
    resultEl.textContent = "❌ Backend tidak merespon. Menggunakan generator lokal.\n\n" +
      generateLocalQuiz(topic, grade, type, count);
  }
});

// === Fallback: Generator Lokal ===
function generateLocalQuiz(topic, grade, type, count) {
  let text = `=== SOAL OTOMATIS (${topic.toUpperCase()}) — Kelas ${grade} ===\n\n`;

  for (let i = 1; i <= count; i++) {
    if (type === "mcq") {
      text += `${i}. Buat soal pilihan ganda tentang "${topic}".\n`;
      text += `   A. O
