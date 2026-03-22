export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { name, email, phone, call_date, call_time, message } = body;

    const scriptUrl = "https://script.google.com/macros/s/AKfycbzWixYNgnseRYU1qmkqRhiyNYorOrQQW7X5mlqJe4MxVevvyl7iBbK7DmN2FLMZNMAs_Q/exec";

    const params = new URLSearchParams({
      name: name || "",
      email: email || "",
      phone: phone || "",
      wedding_date: call_date || "",
      package: `📞 Book a Call — ${call_time || ""}`,
      message: message ? `Call time: ${call_time}\n\n${message}` : `Call time: ${call_time}`,
    });

    const response = await fetch(`${scriptUrl}?${params.toString()}`, {
      method: "GET",
      redirect: "follow",
    });

    const text = await response.text();
    return res.status(200).json({ success: true, result: text });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
