export default async function handler(req, res) {
  // Archivo: api/chat.js — súbelo en la carpeta "api/" de tu repositorio
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { messages } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "Eres un asistente especializado en Blackboard para docentes universitarios. Responde de forma clara, concisa y profesional en español. Da pasos concretos cuando sea necesario. Máximo 3-4 oraciones o pasos numerados.",
        messages
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "No pude procesar tu consulta.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Error al conectar con el asistente." });
  }
}
