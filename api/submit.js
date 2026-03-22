// v3 - updated script url
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
    console.log("Body received:", JSON.stringify(body));

    const { name, email, wedding_date, package: pkg, message } = body;

    const scriptUrl = "https://script.google.com/macros/s/AKfycbzWixYNgnseRYU1qmkqRhiyNYorOrQQW7X5mlqJe4MxVevvyl7iBbK7DmN2FLMZNMAs_Q/exec";

    const params = new URLSearchParams({
      name: name || "",
      email: email || "",
      wedding_date: wedding_date || "",
      package: pkg || "",
      message: message || "",
    });

    const fullUrl = `${scriptUrl}?${params.toString()}`;
    console.log("Calling URL:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      redirect: "follow",
    });

    console.log("Response status:", response.status);
    const text = await response.text();
    console.log("Response body:", text);

    return res.status(200).json({ success: true, result: text });

  } catch (err) {
    console.error("Fetch error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
