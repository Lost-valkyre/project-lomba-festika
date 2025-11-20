// === CONFIG BACKEND ===
// Isi dengan URL backend kamu (misalnya dari Vercel)
const BACKEND_URL = "https://project-lomba-backend-4k6379c4r-leons-projects-85c419b9.vercel.app";

const form = document.getElementById("quizForm");
const resultEl = document.getElementById("result");
const copyBtn = document.getElementById("copy");
const downloadBtn = document.getElementById("download");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const topic = document.getElementById("topic").value.trim();
  const grade = document.getElementById("grade").value;
  const type = document.getElementById("type").value;
  const count = parseInt(document.getElementById("count").value);

  resultEl.textContent = "⏳ Membuat soal dengan AI...";

  try {
    // Jika backend aktif → gunakan AI beneran
    if (BACKEND_URL) {
      const resp = await fetch(`${BACKEND_URL}/api/generate`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, grade, type, count }),
      });

      const data = await resp.json();

      if (data.quizText) {
        resultEl.textContent = data.quizText;
        return;
      }
    }

    // FALLBACK: generator lokal (jika backend mati)
    resultEl.textContent = generateLocalQuiz(topic, grade, type, count);

  } catch (err) {
    resultEl.textContent = "❌ Error: " + err.message;
  }
});

// === Fallback Generator Lokal ===
function generateLocalQuiz(topic, grade, type, count) {
  let text = `=== SOAL OTOMATIS — ${topic.toUpperCase()} (Kelas ${grade}) ===\n\n`;

  for (let i = 1; i <= count; i++) {
    if (type === "mcq") {
      text += `${i}. Buatlah soal pilihan ganda mengenai "${topic}"!\n`;
      text += `   A. Opsi A\n   B. Opsi B\n   C. Opsi C\n   D. Opsi D\n\n`;
    } else if (type === "essay") {
      text += `${i}. Jelaskan materi "${topic}" secara rinci!\n\n`;
    } else if (type === "tf") {
      text += `${i}. Pernyataan tentang "${topic}". (Benar / Salah)\n\n`;
    }
  }
  return text;
}

// === Copy to clipboard ===
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(resultEl.textContent);
  alert("✔ Disalin!");
});

// === Download soal ===
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([resultEl.textContent], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "soal.txt";
  a.click();
});
