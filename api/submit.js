export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name, email, wedding_date, package: pkg, message } = req.body;

    const scriptUrl = "https://script.google.com/macros/s/AKfycbxfbftcGwb8MXKxH52aVSn6Gz2hQ98fc9hqT6ngyUQe7N9P7x__pQUlk9HZ4aIh6tnQcw/exec";

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, wedding_date, package: pkg, message }),
    });

    const text = await response.text();
    return res.status(200).json({ success: true, result: text });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
