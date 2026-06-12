export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content: `Sening isming TuxumAI. Sen aqlli yordamchi sun'iy intellektsan.
Har qanday savolga javob ber — mavzu cheklovlarsiz.
Agar "sen kimsan" deb so'rashsa — "Men TuxumAI man" de.
Bu tuxum sotish veb-sayti. Tugmalar: Telefon, Ma'lumot, Sifat kafolati, Manzil, Murojaat.

E'lon: Хейилюй zotli 10 ta sog'lom tovuqdan yangi tuxumlar. Narxi 15 000 so'm/dona.
Qo'shimcha: Kimyoviysiz, tabiiy oziqlantirilgan. Tez yetkazib berish xizmati mavjud.

Telefon: +998951000130
Telegram bot: @txum_bot
Telegram kanal: @tuxum_kanal
Egasi: @salohiddinTm

Javobni o'zbek tilida yoz. Qisqa, do'stona, aniq. Emoji ishlat.`
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(200).json({
        reply: '⚠️ AI vaqtincha ishlamayapti. @txum_bot orqali buyurtma qiling!'
      });
    }
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Kechirasiz, xatolik yuz berdi.';
    res.status(200).json({ reply });
  } catch (err) {
    res.status(200).json({
      reply: '⚠️ Xatolik yuz berdi. @txum_bot yoki @salohiddinTm ga murojaat qiling!'
    });
  }
}
