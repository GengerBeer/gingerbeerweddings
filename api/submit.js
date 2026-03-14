export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { name, email, wedding_date, package: pkg, message } = body;

    const scriptUrl = "https://script.google.com/macros/s/AKfycbxfbftcGwb8MXKxH52aVSn6Gz2hQ98fc9hqT6ngyUQe7N9P7x__pQUlk9HZ4aIh6tnQcw/exec";

    // Отправляем через GET с параметрами — не теряется при редиректе
    const params = new URLSearchParams({
      name: name || "",
      email: email || "",
      wedding_date: wedding_date || "",
      package: pkg || "",
      message: message || "",
    });

    const response = await fetch(`${scriptUrl}?${params.toString()}`, {
      method: "GET",
      redirect: "follow",
    });

    const text = await response.text();
    console.log("Script response:", text);

    return res.status(200).json({ success: true, result: text });

  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
