const BACKEND_URL = ""; 

const form = document.getElementById("quizForm");
const resultEl = document.getElementById("result");
const copyBtn = document.getElementById("copy");
const downloadBtn = document.getElementById("download");

function localGenerate(topic, grade, type, count) {
  let output = `=== SOAL OTOMATIS — ${topic.toUpperCase()} (Kelas ${grade}) ===\n\n`;

  for (let i = 1; i <= count; i++) {
    if (type === "mcq") {
      output += `${i}. Jelaskan konsep mengenai "${topic}"!\n`;
      output += `   A. Opsi A\n   B. Opsi B\n   C. Opsi C\n   D. Opsi D\n\n`;
    } else if (type === "essay") {
      output += `${i}. Uraikan penjelasan mengenai "${topic}".\n\n`;
    } else if (type === "tf") {
      output += `${i}. Pernyataan tentang "${topic}" ini benar atau salah?\n\n`;
    }
  }

  return output;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const topic = document.getElementById("topic").value.trim();
  const grade = document.getElementById("grade").value;
  const type = document.getElementById("type").value;
  const count = parseInt(document.getElementById("count").value, 10) || 5;

  resultEl.textContent = "Sedang membuat soal…";

  try {
    if (BACKEND_URL) {
      const resp = await fetch(`${BACKEND_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, grade, type, count })
      });

      const data = await resp.json();
      resultEl.textContent = data.quizText;
    } else {
      resultEl.textContent = localGenerate(topic, grade, type, count);
    }
  } catch {
    resultEl.textContent = localGenerate(topic, grade, type, count);
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(resultEl.textContent);
  alert("Teks disalin!");
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([resultEl.textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quiz.txt";
  a.click();

  URL.revokeObjectURL(url);
});
