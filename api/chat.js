export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY; // Key được giấu ở đây!
  const { message } = req.body;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Bạn là một sử gia Việt Nam uyên bác. Hãy trả lời câu hỏi này: " + message }] }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}