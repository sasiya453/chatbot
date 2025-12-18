const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// System Instruction for Sinhala context
const systemPrompt = "ඔබ ඉතා සුහදශීලී සිංහල සහායකයෙක්. ඔබ පරිශීලකයා සමඟ මිත්‍රශීලීව සිංහලෙන් කතා කළ යුතුයි. කෙටි සහ පැහැදිලි පිළිතුරු ලබා දෙන්න.";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  const { message } = req.body;
  if (!message || !message.text) return res.status(200).send("OK");

  const chatId = message.chat.id;
  const userText = message.text;

  try {
    // Generate AI Response
    const prompt = `${systemPrompt}\nපරිශීලක: ${userText}\nසහායක:`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Send back to Telegram
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
    await axios.post(telegramUrl, {
      chat_id: chatId,
      text: responseText,
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error:", error);
    res.status(200).send("Error");
  }
};
