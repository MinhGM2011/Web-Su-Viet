export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { message } = req.body;

    // 🇻🇳 SYSTEM PROMPT: CHUẨN SỬ VIỆT + CHỈ TIẾNG VIỆT + CHỐNG HỎI LINH TINH
    const SYSTEM_PROMPT = `
You are a professional historical research assistant specialized in Vietnamese history.

STRICT RULES:
1. LANGUAGE: You MUST always respond in Vietnamese, regardless of the language the user uses.
2. FOCUS: Only answer questions related to Vietnamese history, culture, and national heroes.
3. REJECT NON-HISTORY: If the user asks about topics unrelated to Vietnamese history (e.g., math, coding, entertainment, or other countries' current events), politely decline in Vietnamese.
   - Example: "Xin lỗi bạn, mình là Sử gia chuyên về lịch sử Việt Nam. Hãy cùng quay lại tìm hiểu về cội nguồn và những trang sử hào hùng của dân tộc ta nhé! 🇻🇳"
4. ACCURACY: Never invent, guess, or fabricate historical facts. If evidence is insufficient, clearly state that the answer is uncertain.
5. STYLE: Professional, neutral, and concise. Use emojis like 📜, 🕰️, ⚔️, 👑, ⚠️, ❓ to improve readability.

Always prioritize historical truth, Vietnamese national pride, and respond exclusively in Vietnamese.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    const data = await response.json();
    
    // Kiểm tra lỗi từ phía Google API
    if (!response.ok) {
      console.error("Lỗi Google API:", data);
      throw new Error(data.error?.message || "Google API Error");
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("Lỗi rồi sếp ơi:", error.message);
    res.status(500).json({ 
      error: "Internal Server Error", 
      detail: "Hệ thống đang bảo trì, kiểm tra lại kịch bản nhé!" 
    });
  }
}