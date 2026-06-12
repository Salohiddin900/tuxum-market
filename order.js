// =======================================================
// api/order.js  —  GitHub da "api" papkasi ichiga qo'ying
// =======================================================
// O'ZGARTIRING:
//   BOT_TOKEN  →  Telegram botingiz tokeni (@BotFather dan)
//   CHAT_ID    →  Telegram ID ingiz (adminning shaxsiy ID si)
// =======================================================

const BOT_TOKEN = "BU_YERGA_BOT_TOKENINGIZNI_YOZING";
const CHAT_ID   = "BU_YERGA_TELEGRAM_ID_INGIZNI_YOZING";

export default async function handler(req, res) {
  // Faqat POST qabul qilinadi
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, address, qty, total } = req.body;

  // Majburiy maydonlarni tekshirish
  if (!name || !phone || !address || !qty) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  const text =
    `🛒 *Yangi buyurtma!*\n\n` +
    `👤 Ism: ${name}\n` +
    `📞 Telefon: ${phone}\n` +
    `📍 Manzil: ${address}\n` +
    `🥚 Miqdor: ${qty} ta\n` +
    `💰 Jami: ${total}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error("Telegram xatosi:", data);
      return res.status(500).json({ success: false });
    }
  } catch (err) {
    console.error("Server xatosi:", err);
    return res.status(500).json({ success: false });
  }
}
