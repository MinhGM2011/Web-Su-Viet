app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const body = {
      contents: [{
        role: "user",
        parts: [{
          text: `
Bạn là chatbot lịch sử Việt Nam.
Chỉ trả lời lịch sử Việt Nam chính thống.
Không suy đoán.
Không bàn chính trị hiện đại.

Câu hỏi: ${userMessage}
`
        }]
      }]
    };

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const data = await r.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Em chưa thể trả lời câu hỏi này.";

    res.json({ reply });
  } catch (e) {
    res.json({ reply: "Bot đang mệt, Sếp quay lại sau nhé 😵‍💫" });
  }
});
